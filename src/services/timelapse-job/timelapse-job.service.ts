import { Injectable } from '@nestjs/common';
import * as FFMpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as FFMpeg from 'fluent-ffmpeg';
import { TimelapseJobEntity } from '../../entities/timelapse-job-entity';
import { Job } from 'bull';
import { StreamedHttpResourceProvider } from '../streamed-resource-provider/streamed-http-resource-provider';
import { StreamedFsResourceProvider } from '../streamed-resource-provider/streamed-fs-resource-provider';

@Injectable()
export class TimelapseJobService {
  constructor(private readonly streamedHttpResourceProvider: StreamedHttpResourceProvider,
              private readonly streamedFsResourcesProvider: StreamedFsResourceProvider) {}

  streamedConversion(job: Job<TimelapseJobEntity>,
                     onCompleteCb: (error: Error, resultData: any) => void,
                     onProgressCb?: (job: Job<TimelapseJobEntity>, percentageProgress: number) => void,
                     videoConverterApi?: FFMpeg.FfmpegCommand): void {

    // todo: move that to config file
    const OUTPUT_DEST: string = 'processed_resources/';
    const outputFilename = job.id + '.mp4';

    videoConverterApi = videoConverterApi || FFMpeg();
    videoConverterApi.setFfmpegPath(FFMpegInstaller.path);

    // todo: test whether pipe's nested event emitting affects conversion progress
    // todo: make converter`s options customizable via POST request
    videoConverterApi
      .input(this.streamedHttpResourceProvider.pullResourcesPipe(job.data.frameSources))
      .inputFormat('image2pipe')
      .inputFps(30)
      .outputFormat('mp4')
      .output(this.streamedFsResourcesProvider.saveResourcesPipe(OUTPUT_DEST + outputFilename))
      .videoCodec('libx264')
      .addOutputOption('-pix_fmt yuv420p')
      .addOutputOption('-movflags frag_keyframe+empty_moov')
      .outputFps(30)
      .noAudio()
      .on('end', () => {
        onCompleteCb(null, outputFilename);
      })
      .on('progress', (progress: any) =>
        onProgressCb(job, 100 * progress.frames / job.data.frameSources.length),
      )
      .on('error', (err: string) => {
        onCompleteCb(
            new Error(err), null,
        );
        },
      )
      .run();
  }
}

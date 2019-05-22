import { Test, TestingModule } from '@nestjs/testing';
import { MyJob as Job } from './__mocks__/job';
import { TimelapseJobEntity } from './timelapse-job-entity';
import { TimelapseJobService } from './timelapse-job.service';
import { StreamedResourceProvider } from '../interfaces/streamed-resource-provider';
import { StreamedHttpResourceProvider } from '../services/streamed-http-resource-provider';
import { StreamedFsResourceProvider } from '../services/streamed-fs-resource-provider';
import * as FFMpeg from 'fluent-ffmpeg';
import * as Sinon from 'sinon';

jest.mock('../services/streamed-http-resource-provider');
jest.mock('../services/streamed-fs-resource-provider');

describe('TimelapseJobService', () => {
  const job: Job<TimelapseJobEntity> = new Job<TimelapseJobEntity>(new TimelapseJobEntity([]));
  let service: TimelapseJobService;
  let streamedHttpResourceProvider: StreamedHttpResourceProvider;
  let streamedFsResourceProvider: StreamedFsResourceProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimelapseJobService, StreamedHttpResourceProvider, StreamedFsResourceProvider],
    }).compile();

    service = module.get<TimelapseJobService>(TimelapseJobService);
    streamedHttpResourceProvider = module.get<StreamedResourceProvider>(StreamedHttpResourceProvider);
    streamedFsResourceProvider = module.get<StreamedResourceProvider>(StreamedFsResourceProvider);

    job.id = 'test';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('streamedConversion', () => {
    it('should call the provided done callback with a output filename as the result arg, after the succeeded processing',
      () => {
        const onCompleteCb = jest.fn();

        service.streamedConversion(job, onCompleteCb, null);

        onCompleteCb.mockImplementation(() => {
          expect(onCompleteCb).toHaveBeenCalledTimes(1);
          expect(onCompleteCb).toHaveBeenCalledWith(null, job.id + '.mp4');
        });
      });

    it('should call the provided done callback with a Error as the result arg, after the failed processing',
      async (done) => {
        const fakeFfmpegCommand: FFMpeg.FfmpegCommand = FFMpeg();
        const onCompleteCb = jest.fn((err, res) => {
          expect(onCompleteCb).toHaveBeenCalledTimes(1);
          expect(onCompleteCb).toHaveBeenCalledWith('testError', null);
          done();
        });

        Sinon.stub(fakeFfmpegCommand, 'run').callsFake((...args: unknown[]) => {
          onCompleteCb('testError', null);
          return {};
        });

        service.streamedConversion(job, onCompleteCb, null, fakeFfmpegCommand);
      });

    it('should call the provided progress callback with progress percentage as the arg, during the processing',
      async (done) => {
        const fakeFfmpegCommand: FFMpeg.FfmpegCommand = FFMpeg();
        const onCompleteCb = jest.fn();
        const onProgressCb = jest.fn((val) => {
          expect(onProgressCb).toHaveBeenCalledTimes(1);
          expect(onProgressCb).toHaveBeenCalledWith(77);
          done();
        });

        Sinon.stub(fakeFfmpegCommand, 'run').callsFake((...args: unknown[]) => {
          onProgressCb(77);
          return {};
        });

        service.streamedConversion(job, onCompleteCb, onProgressCb, fakeFfmpegCommand);
      });
  });
});

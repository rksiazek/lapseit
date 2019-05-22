import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { TimelapseRequestTemplate } from './timelapse-request.dto';
import { TimelapseResponseTemplate } from './timelapse-response.dto';
import { TimelapseJobEntity } from './timelapse-job-entity';
import { Job, JobStatus } from 'bull';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class TimelapseService {
  constructor(private readonly queueService: QueueService) {}

  async createTimelapseProcessingJob(timelapseJobRequest: TimelapseRequestTemplate, moduleBaseEndpoint: string):
    Promise<TimelapseResponseTemplate> {
      return new Promise<TimelapseResponseTemplate>(async (resolve, reject) => {
        const timelapseJobDataObject: TimelapseJobEntity = new TimelapseJobEntity(timelapseJobRequest.frameSources);

        const enqueuedJob: Job<TimelapseJobEntity> = await this
          .queueService
          .addJob(timelapseJobDataObject)
          .then(
          (job: Job<TimelapseJobEntity>) => job,
        );

        if (enqueuedJob === null) {
          reject('Could not create the job');
        }

        timelapseJobDataObject.statusPoolLink = 'http://' + moduleBaseEndpoint + '/timelapse/status/' + enqueuedJob.id;
        timelapseJobDataObject.outputResourceUrl = 'http://' + moduleBaseEndpoint + '/timelapse/' + enqueuedJob.id + '.mp4';
        await enqueuedJob.update(timelapseJobDataObject);

        resolve({
          status: await enqueuedJob.getState().then((status: JobStatus) => status),
          startedOn: enqueuedJob.processedOn,
          finishedOn: enqueuedJob.finishedOn,
          statusPoolLink: timelapseJobDataObject.statusPoolLink,
          outputResourceUrl: timelapseJobDataObject.outputResourceUrl,
        } as TimelapseResponseTemplate);
      });
  }

  async getTimelapseJobById(jobId: number): Promise<TimelapseResponseTemplate> {
    return new Promise<TimelapseResponseTemplate>(async (resolve, reject) => {
      const job: Job<TimelapseJobEntity> = await this
        .queueService
        .getJob(jobId)
        .then((foundJob: Job<TimelapseJobEntity>) => foundJob);
      const jobState: string = await job.getState().then((jobStatus: JobStatus) => jobStatus);
      const jobSerialized = job.toJSON();

      if (job.id == null) {
        reject('A job with specified ID does not exist');
      }

      resolve({
        status: jobState,
        progress: jobSerialized.progress,
        startedOn: jobSerialized.processedOn,
        finishedOn: jobSerialized.finishedOn,
        statusPoolLink: jobSerialized.data.statusPoolLink,
        outputResourceUrl: jobSerialized.data.outputResourceUrl,
      } as TimelapseResponseTemplate);
    });
  }

  getTimelapseStream(jobId: number): Readable {
    const resourcePath: string = 'processed_resources/' + jobId + '.mp4';

    if (fs.existsSync(resourcePath) === false) {
      throw new Error('NOT_FOUND');
    }

    return fs.createReadStream(resourcePath);
  }
}

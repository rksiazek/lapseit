import { Injectable } from '@nestjs/common';
import { QueueService } from "./queue.service";
import { TimelapseRequestTemplate, TimelapseResponseTemplate } from "./timelapse.dto";
import { TimelapseJobEntity } from "./timelapse-job-entity";
import { Job, JobStatus } from "bull";
import * as fs from "fs";
import { Readable } from "stream";

@Injectable()
export class TimelapseService {
  constructor(private readonly queueService: QueueService) {}

  async createTimelapseProcessingJob(timelapseJobRequest: TimelapseRequestTemplate, moduleBaseEndpoint: string):
    Promise<TimelapseResponseTemplate> {
      return new Promise<TimelapseResponseTemplate>(async (resolve, reject) => {
        let timelapseJobDataObject: TimelapseJobEntity = new TimelapseJobEntity(timelapseJobRequest.frame_sources);

        let enqueuedJob: Job<TimelapseJobEntity> = await this
          .queueService
          .addJob(timelapseJobDataObject)
          .then(
          (job: Job<TimelapseJobEntity>) => job
        );

        if(enqueuedJob === null) {
          reject('Could not create the job');
        }

        timelapseJobDataObject.statusPoolLink = 'http://' + moduleBaseEndpoint + '/timelapse/status/' + enqueuedJob.id;
        timelapseJobDataObject.outputResourceUrl = 'http://' + moduleBaseEndpoint + '/timelapse/' + enqueuedJob.id + '.mp4';
        await enqueuedJob.update(timelapseJobDataObject);

        resolve(<TimelapseResponseTemplate>{
          status: await enqueuedJob.getState().then((status: JobStatus) => status),
          started_on: enqueuedJob.processedOn,
          finished_on: enqueuedJob.finishedOn,
          status_pool_link: timelapseJobDataObject.statusPoolLink,
          output_resource_url: timelapseJobDataObject.outputResourceUrl
        });
      })
  }

  async getTimelapseJobById(jobId: number): Promise<TimelapseResponseTemplate> {
    return new Promise<TimelapseResponseTemplate>(async (resolve, reject) => {
      let job: Job<TimelapseJobEntity> = await this
        .queueService
        .getJob(jobId)
        .then((job: Job<TimelapseJobEntity>) => job);
      let jobState: string = await job.getState().then((jobState: JobStatus) => jobState);
      let jobSerialized = job.toJSON();

      if(job == null) {
        reject('A job with specified ID does not exist');
      }

      resolve(<TimelapseResponseTemplate>{
        status: jobState,
        progress: jobSerialized.progress,
        started_on: jobSerialized.processedOn,
        finished_on: jobSerialized.finishedOn,
        status_pool_link: jobSerialized.data.statusPoolLink,
        output_resource_url: jobSerialized.data.outputResourceUrl
      })
    })
  }

  getTimelapseStream(jobId: number): Readable {
    let resourcePath: string = 'processed_resources/' + jobId + '.mp4';

    if(fs.existsSync(resourcePath) === false) {
      console.log(new Error('NOT_FOUND'));
    }

    return fs.createReadStream(resourcePath);
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from "nest-bull";
import { DoneCallback, Job, Queue } from "bull";

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(@InjectQueue() private readonly queue: Queue) {}

  async addJob(jobData: any, jobType?: string): Promise<Job> {
    // todo: move timelapse generation job`s tag to global defs
    return await this.queue.add(jobType || 'generate-timelapse', jobData).then((newJob: Job) => newJob);
  }

  async getJob(jobId: number): Promise<Job> {
    return await this.queue.getJob(jobId).then((job: Job) => job);
  }

  onModuleInit() {
    this.queue.process((job: Job, done: DoneCallback) => {
      done(null, job.data);
    });
  }
}

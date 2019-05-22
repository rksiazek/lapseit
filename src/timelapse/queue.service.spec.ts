import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import {BullModule, getQueueToken} from 'nest-bull';
import * as Sinon from 'sinon';
import {MyJob as Job} from './__mocks__/job';
import {Queue} from 'bull';

describe('QueueService', () => {
  let service: QueueService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({}),
      ],
      providers: [QueueService],
    }).compile();

    service = module.get<QueueService>(QueueService);
    queue = module.get<Queue>(getQueueToken(''));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addJob', () => {
    it('should pass new job request to the queue module', async () => {
      Sinon.stub(queue, 'add')
        .callsFake((jobData: any) =>
          new Promise(resolve => {
            const job: Job<any> = new Job<any>(jobData);
            job.id = 23;
            resolve(job);
          }),
        );

      await service.addJob({test: 'test'}).then((job: Job<any>) => {
        expect(job.id).toBe(23);
      });
    });
  });

  describe('getJob', () => {
    it('should return Job with specified id', async () => {
      const testJob: Job<any> = new Job<any>(null);
      testJob.id = 24;

      Sinon.stub(queue, 'getJob')
        .callsFake((jobId: number) =>
          new Promise((resolve, reject) => {
            if (jobId === testJob.id) {
              resolve(testJob);
            } else {
              reject('Job not found');
            }
          }),
        );

      await service.getJob(24).then((job) => {
        expect(job).toBe(testJob);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TimelapseJobsQueueService } from './timelapse-jobs-queue.service';
import { TimelapseJobService } from './timelapse-job.service';
import { MyJob as Job } from './__mocks__/job';
import { TimelapseJobEntity } from './timelapse-job-entity';

jest.mock('./timelapse-job.service');

describe('TimelapseJobsQueueService', () => {
  let service: TimelapseJobsQueueService;
  let jobService: TimelapseJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimelapseJobsQueueService, TimelapseJobService],
    }).compile();

    service = module.get<TimelapseJobsQueueService>(TimelapseJobsQueueService);
    jobService = module.get<TimelapseJobService>(TimelapseJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should handle job`s done/error and progress events', (done: () => void) => {
    const job: Job<TimelapseJobEntity> = new Job<TimelapseJobEntity>(null);

    const onCompleteCb = jest.fn();
    const spyOnProgress = jest.spyOn(service, 'onProgress');
    service.processTimelapse(job, onCompleteCb);

    setTimeout(() => {
      expect(spyOnProgress).toHaveBeenCalledTimes(3);
      expect(spyOnProgress).lastCalledWith(job, 100);
      expect(onCompleteCb).toHaveBeenCalledTimes(1);
      expect(onCompleteCb).toHaveBeenCalledWith(new Error('error'), 'success');

      done();
    }, 200);
  });

  describe('onProgress', () => {
    test('should update job`s progress', (done: () => void) => {
      const job: Job<TimelapseJobEntity> = new Job<TimelapseJobEntity>(null);
      const onCompleteCb = jest.fn();

      jobService.streamedConversion(job, onCompleteCb, service.onProgress);

      setTimeout(() => {
        expect(job.toJSON()).toHaveProperty('progress', 48);
      }, 20);

      setTimeout(() => {
        expect(job.toJSON()).toHaveProperty('progress', 99);
      }, 50);

      setTimeout(() => {
        expect(job.toJSON()).toHaveProperty('progress', 100);
        done();
      }, 130);
    });
  });
});

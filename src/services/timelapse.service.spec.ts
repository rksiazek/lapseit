import { Test, TestingModule } from '@nestjs/testing';
import { TimelapseService } from './timelapse.service';
import { QueueService } from './queue.service';
import { MyJob as Job } from '../entities/__mocks__/job';
import { TimelapseRequestTemplate } from '../dto/timelapse-request.dto';
import { TimelapseResponseTemplate } from '../dto/timelapse-response.dto';
import { JobStatus } from 'bull';
import * as Sinon from 'sinon';
import * as fs from 'fs';
import {PathLike} from 'fs';
import { ReadStream } from 'fs';
import {PassThrough} from 'stream';

jest.mock('./queue.service');
jest.mock('./streamed-resource-provider/streamed-http-resource-provider');
jest.mock('fs');

describe('TimelapseService', () => {
  let service: TimelapseService;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimelapseService, QueueService],
    }).compile();

    service = module.get<TimelapseService>(TimelapseService);
    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

/*  describe('createTimelapseProcessingJob', () => {
    it('should parse valid, requested timelapse job`s data, call underlying queue service method and return result object',
      async (done) => {
        const job: Job<any> = new Job<any>([]);
        const request: TimelapseRequestTemplate = {
          frameSources: ['test1', 'test2'],
          notificationsUrl: 'test',
          notificationsCustomData: 'test',
        };

        const testJobId: number = 555;
        const testHostHeader: string = 'test.test';

        const expectedResult: TimelapseResponseTemplate = {
          status: 'waiting',
          startedOn: 123123123,
          finishedOn: 321321321,
          statusPoolLink: 'http://' + testHostHeader + '/timelapse/status/' + testJobId,
          outputResourceUrl: 'http://' + testHostHeader + '/timelapse/' + testJobId + '.mp4',
        };

        Sinon.stub(queueService, 'addJob')
          .callsFake((jobData: any) => new Promise(resolve => {
            expect(jobData).toHaveProperty('frameSources', request.frameSources);

            job.processedOn = expectedResult.startedOn;
            job.finishedOn = expectedResult.finishedOn;
            job.id = testJobId;

            resolve(job);
          }));

        Sinon.stub(job, 'getState').returns(new Promise(resolve => resolve(expectedResult.status as JobStatus)));

        const spyOnResolve = jest.fn();
        const spyOnReject = jest.fn();

        await new Promise((resolve) => {
          service.createTimelapseProcessingJob(request, testHostHeader)
            .then(value => {
                spyOnResolve(value);
                resolve();
              }
              , reason => {
                spyOnReject(reason);
                resolve();
              });
        })
          .then(() => {
            expect(spyOnReject).toHaveBeenCalledTimes(0);
            expect(spyOnResolve).toHaveBeenCalled();
            expect(spyOnResolve).toHaveBeenCalledWith(expectedResult);

            done();
          });
      });
  });*/

  describe('getTimelapseJobById', () => {
    it('should return the job with provided ID',
      async (done) => {
        const job: Job<any> = new Job<any>([]);

        const testJobId: number = 555;

        const expectedResult: TimelapseResponseTemplate = {
          status: 'waiting',
          startedOn: 123123123,
          finishedOn: 321321321,
          statusPoolLink: 'http://test.test/timelapse/status/' + testJobId,
          outputResourceUrl: 'http://test.test/timelapse/' + testJobId + '.mp4',
        };

        Sinon.stub(queueService, 'getJob')
          .callsFake((jobId: number) => new Promise(resolve => {
            expect(jobId).toBeDefined();
            expect(jobId).toBeGreaterThanOrEqual(0);

            job.id = testJobId;
            job.processedOn = expectedResult.startedOn;
            job.finishedOn = expectedResult.finishedOn;
            job.data = {
              statusPoolLink: expectedResult.statusPoolLink,
              outputResourceUrl: expectedResult.outputResourceUrl,
            };

            resolve(job);
          }));

        Sinon.stub(job, 'getState').returns(new Promise(resolve => resolve(expectedResult.status as JobStatus)));

        const spyOnResolve = jest.fn();
        const spyOnReject = jest.fn();

        await new Promise((resolve) => {
          service.getTimelapseJobById(testJobId)
            .then(value => {
                spyOnResolve(value);
                resolve();
              }
              , reason => {
                spyOnReject(reason);
                resolve();
              });
        })
          .then(() => {
            expect(spyOnReject).toHaveBeenCalledTimes(0);
            expect(spyOnResolve).toHaveBeenCalled();
            expect(spyOnResolve).toHaveBeenCalledWith(expectedResult);

            done();
          });
      });
  });

  describe('getTimelapseStream', () => {
    it('should return video stream containing timelapse with provided, valid ID', async (done) => {
      const testJobId = 555;

      Sinon.stub(fs, 'existsSync').callsFake((path: PathLike) => {
        expect(path).toContain(testJobId + '.mp4');
        return true;
      });

      Sinon.stub(fs, 'createReadStream').callsFake((
          path: PathLike, options?: string | {
            flags?: string;
            encoding?: string;
            fd?: number;
            mode?: number;
            autoClose?: boolean;
            start?: number;
            end?: number;
            highWaterMark?: number;
          },
        ) => {
          const readStream: PassThrough = new PassThrough();
          readStream.push('test1');

          return readStream as unknown as ReadStream;
      });

      const testStream: PassThrough = new PassThrough();
      testStream.on('data', (chunk) => {
        expect(chunk.toString()).toEqual('test1');
        done();
      });

      service.getTimelapseStream(testJobId).pipe(testStream);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TimelapseService } from './timelapse.service';
import { QueueService } from "./queue.service";
import { MyJob as Job } from "./__mocks__/job";
import { TimelapseRequestTemplate, TimelapseResponseTemplate } from "./timelapse.dto";
import { JobStatus } from "bull";
import * as Sinon from "sinon";
import * as fs from "fs";
import {PathLike} from "fs";
import { ReadStream } from 'fs'
import * as StreamTest from 'streamtest'
import {PassThrough,} from "stream";

jest.mock('./queue.service');
jest.mock('../services/streamed-http-resource-provider');
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

  describe('createTimelapseProcessingJob', function () {
    it('should parse valid, requested timelapse job`s data, call underlying queue service method and return result object',
      async (done) => {
        let job: Job<any> = new Job<any>([]);
        let request: TimelapseRequestTemplate = {
          frame_sources: ['test1', 'test2']
        };

        let testJobId: number = 555;
        let testHostHeader: string = 'test.test';

        let expectedResult: TimelapseResponseTemplate = {
          status: 'waiting',
          started_on: 123123123,
          finished_on: 321321321,
          status_pool_link: 'http://' + testHostHeader + '/timelapse/status/' + testJobId,
          output_resource_url: 'http://' + testHostHeader + '/timelapse/' + testJobId + '.mp4'
        };

        Sinon.stub(queueService, 'addJob')
          .callsFake((jobData: any) => new Promise(resolve => {
            expect(jobData).toHaveProperty('frameSources', request.frame_sources);

            job.processedOn = expectedResult.started_on;
            job.finishedOn = expectedResult.finished_on;
            job.id = testJobId;

            resolve(job);
          }));

        Sinon.stub(job, 'getState').returns(new Promise(resolve => resolve(<JobStatus>expectedResult.status)));

        let spyOnResolve = jest.fn();
        let spyOnReject = jest.fn();

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
      })
  });

  describe('getTimelapseJobById', function () {
    it('should return the job with provided ID',
      async (done) => {
        let job: Job<any> = new Job<any>([]);

        let testJobId: number = 555;

        let expectedResult: TimelapseResponseTemplate = {
          status: 'waiting',
          started_on: 123123123,
          finished_on: 321321321,
          status_pool_link: 'http://test.test/timelapse/status/' + testJobId,
          output_resource_url: 'http://test.test/timelapse/' + testJobId + '.mp4'
        };

        Sinon.stub(queueService, 'getJob')
          .callsFake((jobId: number) => new Promise(resolve => {
            expect(jobId).toBeDefined();
            expect(jobId).toBeGreaterThanOrEqual(0);

            job.id = testJobId;
            job.processedOn = expectedResult.started_on;
            job.finishedOn = expectedResult.finished_on;
            job.data = {
              statusPoolLink: expectedResult.status_pool_link,
              outputResourceUrl: expectedResult.output_resource_url
            };

            resolve(job);
          }));

        Sinon.stub(job, 'getState').returns(new Promise(resolve => resolve(<JobStatus>expectedResult.status)));

        let spyOnResolve = jest.fn();
        let spyOnReject = jest.fn();

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
      })
  });

  describe('getTimelapseStream', function () {
    it('should return video stream containing timelapse with provided, valid ID', async (done) => {
      let testJobId = 555;

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
          }
        ) => {
          let readStream: PassThrough = new PassThrough();
          readStream.push('test1');

          return <ReadStream><unknown>readStream;
      });

      let testStream: PassThrough = new PassThrough();
      testStream.on('data', (chunk) => {
        expect(chunk.toString()).toEqual('test1');
        done();
      });

      service.getTimelapseStream(testJobId).pipe(testStream);
    })
  });
});
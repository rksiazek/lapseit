import { Test, TestingModule } from '@nestjs/testing';
import { TimelapseController } from './timelapse.controller';
import { TimelapseService } from '../services/timelapse.service';

jest.mock('../services/timelapse.service');

describe('Timelapse Controller', () => {
  let controller: TimelapseController;
  let timelapseService: TimelapseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ TimelapseController ],
      providers: [ TimelapseService ],
    }).compile();

    controller = module.get<TimelapseController>(TimelapseController);
    timelapseService = module.get<TimelapseService>(TimelapseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTimelapseGenerationJob', () => {
    it('should return object containing enqueued job data with pool endpoint address', () => {
      // todo
    });
  });

  describe('getJob', () => {
    it('should return a data of job with specified id', () => {
      // todo
    });
  });

  describe('sendProcessedResource', () => {
    it('should return stream of requested resource', () => {
      // todo
    });
  });
});

import { Module } from '@nestjs/common';
import { TimelapseController } from '../controllers/timelapse.controller';
import { TimelapseJobService } from '../services/timelapse-job/timelapse-job.service';
import { TimelapseJobsQueueService } from '../services/timelapse-job/timelapse-jobs-queue.service';
import { BullModule } from 'nest-bull';
import { StreamedHttpResourceProvider } from '../services/streamed-resource-provider/streamed-http-resource-provider';
import { StreamedFsResourceProvider } from '../services/streamed-resource-provider/streamed-fs-resource-provider';
import { QueueService } from '../services/queue.service';
import { TimelapseService } from '../services/timelapse.service';

const REDIS_HOST: string = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT: number = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';

@Module({
  imports: [
    BullModule.forRoot({
      options: {
        redis: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          password: REDIS_PASSWORD,
        },
      },
    }),
  ],
  controllers: [TimelapseController],
  providers: [
    TimelapseJobService,
    TimelapseJobsQueueService,
    StreamedHttpResourceProvider,
    StreamedFsResourceProvider,
    QueueService,
    TimelapseService,
  ],
})
export class TimelapseModule {}

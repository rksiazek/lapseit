import { Module } from '@nestjs/common';
import { TimelapseController } from './timelapse.controller';
import { TimelapseJobService } from './timelapse-job.service';
import { TimelapseJobsQueueService } from './timelapse-jobs-queue.service';
import { BullModule } from 'nest-bull';
import { StreamedHttpResourceProvider } from '../services/streamed-http-resource-provider';
import { StreamedFsResourceProvider } from '../services/streamed-fs-resource-provider';
import { QueueService } from './queue.service';
import { TimelapseService } from './timelapse.service';

@Module({
  imports: [BullModule.forRoot({})],
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

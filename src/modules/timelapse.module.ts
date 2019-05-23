import { Module } from '@nestjs/common';
import { TimelapseController } from '../controllers/timelapse.controller';
import { TimelapseJobService } from '../services/timelapse-job/timelapse-job.service';
import { TimelapseJobsQueueService } from '../services/timelapse-job/timelapse-jobs-queue.service';
import { BullModule } from 'nest-bull';
import { StreamedHttpResourceProvider } from '../services/streamed-resource-provider/streamed-http-resource-provider';
import { StreamedFsResourceProvider } from '../services/streamed-resource-provider/streamed-fs-resource-provider';
import { QueueService } from '../services/queue.service';
import { TimelapseService } from '../services/timelapse.service';

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

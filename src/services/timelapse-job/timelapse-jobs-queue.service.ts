import {
    Queue,
    QueueProcess,
} from 'nest-bull';
import { TimelapseJobService} from './timelapse-job.service';
import { Job, DoneCallback } from 'bull';
import { TimelapseJobEntity } from '../../entities/timelapse-job-entity';

@Queue()
export class TimelapseJobsQueueService {
    constructor(private readonly service: TimelapseJobService) {}

    @QueueProcess({ name: 'generate-timelapse' })
    processTimelapse(job: Job<TimelapseJobEntity>, doneCb: DoneCallback): void {
        this.service.streamedConversion(job, doneCb, this.onProgress);
    }

    onProgress(job: Job<TimelapseJobEntity>, percentageProgress: number): void {
        job.progress(percentageProgress).then();
    }
}

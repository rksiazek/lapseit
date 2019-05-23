import { TimelapseJobEntity } from '../../../entities/timelapse-job-entity';
import * as Bull from 'bull';

export class TimelapseJobService {
  streamedConversion(job: Bull.Job<TimelapseJobEntity>,
                     onCompleteCb: (error: Error, resultData: any) => void,
                     onProgressCb?: (job: Bull.Job<TimelapseJobEntity>, percentageProgress: number) => void) {
    setTimeout(() => onProgressCb(job, 48), 20);
    setTimeout(() => onProgressCb(job, 99), 50);
    setTimeout(() => {
      onProgressCb(job, 100);
      onCompleteCb(new Error('error'), 'success');
    }, 130);
  }
}

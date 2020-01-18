import {
    Queue,
    QueueProcess,
} from 'nest-bull';
import { TimelapseJobService} from './timelapse-job.service';
import { Job, DoneCallback, JobStatus } from 'bull';
import { TimelapseJobEntity } from '../../entities/timelapse-job-entity';
import Axios from 'axios';

@Queue()
export class TimelapseJobsQueueService {
    constructor(private readonly service: TimelapseJobService) {
    }

    @QueueProcess({ name: 'generate-timelapse' })
    processTimelapse(job: Job<TimelapseJobEntity>, doneCb: DoneCallback): void {
        this.service.streamedConversion(job, doneCb, this.onDone, this.onProgress);
    }

    onDone(job: Job<TimelapseJobEntity>, doneCb: DoneCallback, error: Error | null, value: any): void {
        doneCb(error, value);

        job.queue.getJob(job.id).then(fetchedJob => {
            fetchedJob.getState().then((jobStatus: JobStatus) => {
                const jobSerialized = fetchedJob.toJSON();

                Axios.post(fetchedJob.data.notificationsUrl, {
                    status: jobStatus,
                    errorDetails: error === null ? undefined : error.message,
                    progress: jobSerialized.progress,
                    startedOn: jobSerialized.processedOn,
                    finishedOn: Date.now(),
                    statusPoolLink: jobSerialized.data.statusPoolLink,
                    outputResourceUrl: jobSerialized.data.outputResourceUrl,
                    notificationsUrl: jobSerialized.data.notificationsUrl,
                    notificationsCustomData: jobSerialized.data.notificationsCustomData,
                })
                  .catch((err) => {
                      console.error(err);
                  });
            });
        });
    }

    onProgress(job: Job<TimelapseJobEntity>, percentageProgress: number): void {
        job.progress(percentageProgress).then();

        job.queue.getJob(job.id).then(fetchedJob => {
            fetchedJob.getState().then((jobStatus: JobStatus) => {
                const jobSerialized = fetchedJob.toJSON();

                Axios.post(fetchedJob.data.notificationsUrl, {
                    status: jobStatus,
                    progress: jobSerialized.progress,
                    startedOn: jobSerialized.processedOn,
                    finishedOn: jobSerialized.finishedOn,
                    statusPoolLink: jobSerialized.data.statusPoolLink,
                    outputResourceUrl: jobSerialized.data.outputResourceUrl,
                    notificationsUrl: jobSerialized.data.notificationsUrl,
                    notificationsCustomData: jobSerialized.data.notificationsCustomData,
                })
                  .catch((err) => {
                      console.error(err);
                  });
            });
        });
    }
}

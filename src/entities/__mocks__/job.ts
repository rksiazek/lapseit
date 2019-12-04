import * as Bull from 'bull';

export class MyJob<T> implements Bull.Job {
  attemptsMade: number;
  data: T;
  finishedOn: number;
  id: Bull.JobId;
  name: string;
  opts: Bull.JobOptions;
  processedOn: number;
  queue: Bull.Queue<T>;
  returnvalue: any;
  stacktrace: string[];
  timestamp: number;
  progressPerc: number;

  constructor(data: T) {
    this.data = data;
  }

  discard(): Promise<void> {
    return undefined;
  }

  finished(): Promise<any> {
    return undefined;
  }

  getState(): Promise<Bull.JobStatus> {
    return new Promise<Bull.JobStatus>(resolve => {
    resolve('waiting');
  });
  }

  lockKey(): string {
    return '';
  }

  moveToCompleted(returnValue?: string, ignoreLock?: boolean): Promise<[any, Bull.JobId] | null> {
    return undefined;
  }

  moveToFailed(errorInfo: { message: string }, ignoreLock?: boolean): Promise<[any, Bull.JobId] | null> {
    return undefined;
  }

  progress(value: any): Promise<void> {
    return undefined;
  }

  promote(): Promise<void> {
    return undefined;
  }

  releaseLock(): Promise<void> {
    return undefined;
  }

  remove(): Promise<void> {
    return undefined;
  }

  retry(): Promise<void> {
    return undefined;
  }

  takeLock(): Promise<number | false> {
    return undefined;
  }

  toJSON(): {
    id: Bull.JobId;
    name: string;
    data: T;
    opts: Bull.JobOptions;
    progress: number;
    delay: number;
    timestamp: number;
    attemptsMade: number;
    failedReason: any;
    stacktrace: string[] | null;
    returnvalue: any;
    finishedOn: number | null;
    processedOn: number | null
  } {
    return {
      attemptsMade: this.attemptsMade,
      data: this.data,
      delay: undefined,
      failedReason: undefined,
      finishedOn: this.finishedOn,
      id: this.id,
      name: this.name,
      opts: this.opts,
      processedOn: this.processedOn,
      progress: this.progressPerc,
      returnvalue: this.returnvalue,
      stacktrace: this.stacktrace,
      timestamp: this.timestamp,
    };
  }

  update(data: any): Promise<void> {
    return new Promise<void>(resolve => {
      this.data = data;
      resolve();
    });
  }
}

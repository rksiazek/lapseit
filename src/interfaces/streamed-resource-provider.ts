import {PassThrough, Writable} from 'stream';

export interface StreamedResourceProvider {
  pullResourcesPipe(resources: string[]): PassThrough;
  saveResourcesPipe(destination: string): Writable;
}

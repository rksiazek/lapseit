import { StreamedResourceProvider } from '../../../interfaces/streamed-resource-provider';
import { PassThrough, Writable } from 'stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamedHttpResourceProvider implements StreamedResourceProvider {
  pullResourcesPipe(resources: string[]): PassThrough {
    const stream: PassThrough = new PassThrough();

    resources.forEach((value: string) => stream.push(value));
    stream.push(null);

    return stream;
  }

  saveResourcesPipe(destination: string): Writable {
    return new Writable();
  }
}

import { StreamedResourceProvider } from '../interfaces/streamed-resource-provider';
import { PassThrough, Writable } from 'stream';
import * as url from 'url';
import * as https from 'https';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamedHttpResourceProvider implements StreamedResourceProvider {
  pullResourcesPipe(resources: string[]): PassThrough {
    const stream: PassThrough = new PassThrough();

    resources.map((resourceUrl: string) => () => {
      return new Promise((fulfill, reject) => {
        const parsedUrl = url.parse(resourceUrl);
        const requestOptions = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.path,
          port: parsedUrl.port,
          method: 'GET',
        };

        https.get(requestOptions, (response) => {
          response
            .on('end', () => {fulfill(); })
            .on('error', (err: Error) => reject(err))
            .pipe(stream, {end: false});
        }).on('error', (err: Error) => reject(err));
      });
    })
      .reduce((prev, next) => prev.then(next), Promise.resolve({}))
      .then(
        () => {
          stream.end();
        },
        (reason: string) => {
          stream.emit('error', new Error('Failed do pull resources: ' + reason));
        },
      );

    return stream;
  }

  saveResourcesPipe(destination: string): Writable {
    return undefined;
  }
}

import { StreamedResourceProvider } from '../../interfaces/streamed-resource-provider';
import { PassThrough, Writable } from 'stream';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamedFsResourceProvider implements StreamedResourceProvider {
  pullResourcesPipe(resources: string[]): PassThrough {
    const stream: PassThrough = new PassThrough();

    resources.map((resourcePath: string) => () => {
      return new Promise((fulfill, reject) => {
          if (!fs.existsSync(resourcePath)) {
            return reject('File "' + resourcePath + '" does not exist.');
          }

          fs
            .createReadStream(resourcePath)
            .on('end', () => fulfill())
            .on('error', (err: Error) => reject(err))
            // .on("data", chunk => stream.push(chunk));
            .pipe(stream);
      });
    })
      .reduce((prev, next) => prev.then(next), Promise.resolve())
      .then(
        () => stream.end(),
        (reason: string) => stream.emit('error', new Error('Failed do pull resources: ' + reason)),
      );

    return stream;
  }

  saveResourcesPipe(destination: string): Writable {
    fs.mkdirSync(destination.slice(0, destination.lastIndexOf('/')), {recursive: true});

    return fs.createWriteStream(destination)
      .on('error', (err: Error) => new Error('Failed do save resources: ' + err));
  }
}

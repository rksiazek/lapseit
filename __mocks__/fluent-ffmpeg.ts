import { Readable, Writable } from 'stream';
import { EventEmitter } from 'events';

export class FfmpegCommand extends EventEmitter {
  inputSrc: string | Readable;
  outputDst: string | Writable;

  input(source: string | Readable): this {
    this.inputSrc = source;
    return this;
  }

  inputFormat(format: string): this {
    return this;
  }

  inputFps(fps: number): this {
    return this;
  }

  noAudio(): this {
    return this;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.addListener(event, listener);
    return this;
  }

  output(target: string | Writable, pipeopts?: { end?: boolean }): this {
    this.outputDst = target;
    return this;
  }

  outputFormat(format: string): this {
    return this;
  }

  outputFps(fps: number): this {
    return this;
  }

  outputOption(...options: string[]): this {
    return this;
  }

  run(): void {
    (this.inputSrc as Readable).pipe(this.outputDst as Writable);
  }

  videoCodec(codec: string): this {
    return this;
  }
}

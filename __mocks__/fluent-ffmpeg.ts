import { Readable, Writable } from "stream";
import { EventEmitter } from "events";

export class FfmpegCommand extends EventEmitter {
  _input: string | Readable;
  _output: string | Writable;

  input(source: string | Readable): this {
    this._input = source;
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
    this._output = target;
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
    (<Readable>this._input).pipe(<Writable>this._output);
  }

  videoCodec(codec: string): this {
    return this;
  }
}
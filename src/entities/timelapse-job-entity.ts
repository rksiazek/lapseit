export class TimelapseJobEntity {
    frameSources: string[];
    outputResourceUrl: string;
    statusPoolLink: string;

    constructor(frameSources: string[]) {
        this.frameSources = frameSources;
    }
}

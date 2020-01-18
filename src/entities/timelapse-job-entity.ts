export class TimelapseJobEntity {
    frameSources: string[];
    outputResourceUrl: string;
    statusPoolLink: string;
    notificationsUrl: string;
    notificationsCustomData: string;

    constructor(frameSources: string[], notificationsUrl: string, notificationsCustomData: string) {
        this.frameSources = frameSources;
        this.notificationsUrl = notificationsUrl;
        this.notificationsCustomData = notificationsCustomData;
    }
}

export class TimelapseRequestTemplate {
    frame_sources: string[];
}

export class TimelapseResponseTemplate {
    status: string;
    started_on: number;
    finished_on: number;
    status_pool_link: string;
    output_resource_url: string;
}
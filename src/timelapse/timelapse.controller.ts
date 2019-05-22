import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  HttpException,
  HttpStatus,
  Headers, Res,
} from '@nestjs/common';
import { TimelapseRequestTemplate} from './timelapse-request.dto';
import {TimelapseService} from './timelapse.service';

@Controller('timelapse')
export class TimelapseController {
  constructor(private readonly timelapseService: TimelapseService) {}

  @Post()
  async createTimelapseGenerationJob(@Body() requestBody: TimelapseRequestTemplate, @Headers('host') hostHeader: string, @Res() response) {
    response.send(await this
      .timelapseService
      .createTimelapseProcessingJob(requestBody, hostHeader)
      .catch(reason => {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Could not create the job.',
        }, HttpStatus.BAD_REQUEST);
      }),
    );

    return response.status(HttpStatus.CREATED);
  }

  @Get('status/:jobId')
  async getJob( @Param('jobId', new ParseIntPipe()) jobId: number, @Headers('host') hostHeader, @Res() response) {
    response.send(await this
      .timelapseService
      .getTimelapseJobById(jobId)
      .catch(reason => {
        response.send(new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'A job with supplied ID were not found.',
        }, 404));
      }),
    );

    return response.status(200);
  }

  @Get(':resourceName')
  async sendProcessedResource(@Param('resourceName') resourceName: string, @Res() response) {
    const timelapseJobId: number = parseInt(resourceName.slice(0, resourceName.indexOf('.')), 10);

    try {
      response.type('video/mp4').send(this.timelapseService.getTimelapseStream(timelapseJobId));
    } catch (e) {
      response.send(new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'A timelapse with supplied identifier were not found.',
      }, 404));
    }
  }
}

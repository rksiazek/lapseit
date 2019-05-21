import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  HttpException,
  HttpStatus,
  Headers, Res
} from '@nestjs/common';
import { TimelapseRequestTemplate} from "./timelapse.dto";
import {TimelapseService} from "./timelapse.service";

@Controller('timelapse')
export class TimelapseController {
  constructor(private readonly timelapseService: TimelapseService) {}

  @Post()
  async createTimelapseGenerationJob(@Body() requestBody: TimelapseRequestTemplate, @Headers('host') hostHeader: string, @Res() response) {
    try {
      response.send(await this.timelapseService.createTimelapseProcessingJob(requestBody, hostHeader));
      return response.status(HttpStatus.CREATED);
    }
    catch (e) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Could not create the job.'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status/:jobId')
  async getJob( @Param('jobId', new ParseIntPipe()) jobId: number, @Headers('host') hostHeader, @Res() response) {
    try {
      response.send(await this.timelapseService.getTimelapseJobById(jobId));
      response.status(200)
    } catch (e) {
      response.send(new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'A job with supplied ID were not found.'
      }, 404));
    }
  }

  @Get(':resourceName')
  async sendProcessedResource(@Param('resourceName') resourceName: string, @Res() response) {
    let timelapseJobId: number = parseInt(resourceName.slice(0, resourceName.indexOf('.')));

    try {
      response.type('video/mp4').send(this.timelapseService.getTimelapseStream(timelapseJobId));
    } catch (e) {
        response.send(new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'A timelapse with supplied identifier were not found.'
        }, 404));
    }
  }
}
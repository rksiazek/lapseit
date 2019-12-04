import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TimelapseModule } from './modules/timelapse.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    TimelapseModule,
    new FastifyAdapter(),
  );

  app.useStaticAssets({
    root: __dirname + '/processed_resources',
  });

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap().then();

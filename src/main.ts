import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { get } from 'config';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // JSON Body Validation
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: true },
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      skipMissingProperties: true,
      whitelist: true,
      disableErrorMessages: false,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(+get('PORT'));
}
bootstrap();

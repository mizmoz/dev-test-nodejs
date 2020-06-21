import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { get } from 'config';
import cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const options = new DocumentBuilder()
    .setTitle('Dev Test Docs')
    .setDescription('Countries API description')
    .setVersion('1.0')
    .addTag('countries')
    .addBasicAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(+get<any>('PORT'));
}
bootstrap();

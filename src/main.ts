import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Scissor API')
    .setDescription('The Scissor URL Shortener API documentation')
    .setVersion('1.0')
    .addTag('scissor')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
  return 'app started';
}
bootstrap();

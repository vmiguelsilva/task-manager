import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Task Manager')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_HOST}:9092`]
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as express from 'express';
``;
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule, {});

  app.use(express.json({ limit: '50mb' }));
  app.use(express.raw({ type: 'application/json' }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
  });

  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'accesstoken',
      'refreshtoken',
    ],
    exposedHeaders: ['Authorization'],
  });

  // Enable global pipes for HTTP requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('HTTP server is running on http://localhost:3000');

  const grpcApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user_service',
      protoPath: join(__dirname, './infrastructure/grpc/protos/user.proto'),
      url: '0.0.0.0:50051',
    },
  });

  // Start the gRPC server
  await app.startAllMicroservices();
  console.log('gRPC server is running on 0.0.0.0:50051');
}
bootstrap();

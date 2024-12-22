import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';


async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule, {
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.raw({ type: 'application/json' }));
  
  // Add a middleware to debug incoming requests
  app.use((req: any, res: any, next: any) => {
    console.log('Incoming request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    next();
  });

  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization'
  });

  // Enable global pipes for HTTP requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.url, ':', req.method, ':', req.body) ;
    next();
  });

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

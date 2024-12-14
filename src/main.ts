import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule);

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
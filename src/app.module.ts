import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database/database.config';
import { UserModule } from './infrastructure/modules/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get('database.uri');
        const user = configService.get('database.user');
        const pass = configService.get('database.pass');
        const dbName = configService.get('database.dbName');

        logger.log(`Connecting to MongoDB at ${uri}`);

        return {
          uri,
          user,
          pass,
          dbName,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}

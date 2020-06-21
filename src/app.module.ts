import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { redisFactory } from './config-factory';

@Module({
  imports: [
    RedisModule.forRootAsync({ useFactory: redisFactory })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

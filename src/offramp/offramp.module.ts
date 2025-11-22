import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CircleService } from '../circle/circle.service';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule, // <-- indispensable pour injecter ConfigService
  ],
  controllers: [OfframpController],
  providers: [OfframpService, CircleService],
  exports: [OfframpService],
})
export class OfframpModule {}

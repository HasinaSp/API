import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';
import { CircleService } from './circle.service';


@Module({
imports: [HttpModule],
controllers: [OfframpController],
providers: [OfframpService, CircleService],
exports: [OfframpService],
})
export class OfframpModule {}
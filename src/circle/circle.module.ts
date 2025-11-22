import { HttpModule } from '@nestjs/axios';
import { CircleService } from './circle.service';
import { Module } from '@nestjs/common/decorators';

@Module({
  imports: [HttpModule],
  providers: [CircleService],
  exports: [CircleService],
})
export class CircleModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OfframpModule } from './offramp/offramp.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- Rend ConfigService disponible partout
    }),
    HttpModule,
    OfframpModule, // <-- Assure que ton module est chargé
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

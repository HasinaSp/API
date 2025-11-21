/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { OfframpModule } from './offramp/offramp.module';
import { ValidationPipe } from '@nestjs/common';


@Module({
imports: [OfframpModule],
})
class AppModule {}


async function bootstrap() {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.enableCors();
await app.listen(3000);
}
bootstrap();
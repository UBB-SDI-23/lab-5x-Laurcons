import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import PrismaService from './service/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const prisma = app.get(PrismaService);

  // special handling for Prisma
  // https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
  prisma.$on('beforeExit', async () => {
    await app.close();
  });

  await app.listen(parseInt(process.env.PORT || "3021"));
}
bootstrap();

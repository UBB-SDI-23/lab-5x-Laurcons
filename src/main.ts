import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import PrismaService from './service/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3021);

  const prisma = app.get(PrismaService);

  // special handling for Prisma
  // https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
  prisma.$on('beforeExit', async () => {
    await app.close();
  });
}
bootstrap();

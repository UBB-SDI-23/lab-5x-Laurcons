import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import PrismaService from './service/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const swagger = new DocumentBuilder()
    .setTitle('CTP Manager API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  const prisma = app.get(PrismaService);
  // special handling for Prisma
  // https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
  prisma.$on('beforeExit', async () => {
    await app.close();
  });

  const port = parseInt(process.env.PORT || '3021');
  await app.listen(port);
  Logger.log('Listening on port ' + port);
}
bootstrap();

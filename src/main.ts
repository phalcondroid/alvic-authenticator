import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { HttpResponseInterceptor } from './shared/interceptos/http-response.interceptor';
import { HttpExceptionInterceptor } from './shared/interceptos/http-exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionInterceptor());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(80);
}
bootstrap();

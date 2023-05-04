import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'app.module';
import helmet from 'helmet';

export const bootstrap = async () => {
  const { NestFactory } = await import('@nestjs/core');
  const source = await import('source-map-support');
  const { config } = await import('dotenv');

  config();

  source.install();

  const date = new Date().toLocaleTimeString();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });

  const port = Number(process.env.APP_PORT!);

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0', () => {
    const message = `Listening On ${port}`;
    const wrapper = '@'.repeat(message.length);

    Logger.log(wrapper);
    Logger.log(`Scrape Manager Start: ${date}`);
    Logger.log(message);
    Logger.log(wrapper);

    process.send?.('ready');
  });

  // process.on('SIGTERM', () => shutdown(app));

};

await bootstrap();

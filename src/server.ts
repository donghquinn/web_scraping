import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "modules/app.module";

export const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const port = Number(process.env.APP_PORT!);

  app.enableCors();
  app.use(helmet());
  app.enableVersioning();
  app.useBodyParser("json");

  await app.listen(port);

  const message = `Listening On ${port}`;
  const wrapper = "@".repeat(message.length);

  Logger.log(wrapper);
  Logger.log(message);
  Logger.log(wrapper);
};

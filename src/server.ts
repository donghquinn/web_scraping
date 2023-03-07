import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "modules/app.module";

export const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const port = Number(process.env.APP_PORT!);

  await app.listen(port);
};

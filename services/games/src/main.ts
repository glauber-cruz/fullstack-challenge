import "reflect-metadata";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 4001;

  app.enableCors({
    origin: "*",
  });

  const config = new DocumentBuilder()
    .setTitle("Games API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port, "0.0.0.0");
  console.log(`Games service running on port ${port}`);
}

bootstrap();

import "dotenv/config";
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap(): Promise<void> {
  const rabbitMqUrl =
    process.env.RABBITMQ_URL ?? "amqp://admin:admin@rabbitmq:5672";
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
  });
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: "wallets_queue",
      queueOptions: {
        durable: false,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle("Wallets API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT) || 4002;
  await app.startAllMicroservices();
  await app.listen(port, "0.0.0.0");

  console.log(`Wallets service running on port ${port}`);
}

bootstrap();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function start() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  const configSwagger = new DocumentBuilder()
    .setTitle("Transport-Service")
    .setDescription("Prismada transport-service loyihasi API hujjati")
    .setVersion("1.0") 
    .addTag("Transport-Service")
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("api/docs", app, document);
  const config = app.get(ConfigService);
  const PORT = config.get<number>("PORT");
  await app.listen(PORT ?? 3000, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
  });
}
start();

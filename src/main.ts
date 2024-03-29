import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { raw } from "express"
import { appConfigs } from "./app.configs"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(raw({ limit: "11mb", type: "application/x-www-form-urlencoded" }))

  app.enableCors({
    origin: appConfigs.corsOrigin,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })

  app.setGlobalPrefix("/api/v1")
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  await app.listen(appConfigs.port)
}
bootstrap()

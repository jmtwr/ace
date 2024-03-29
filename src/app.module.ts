import { Module } from "@nestjs/common"
import { AppController } from "./health.controller"
import { StripeModule } from "./stripe/stripe.module"

@Module({
  imports: [StripeModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

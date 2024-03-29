import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { appConfigs } from "src/app.configs"
import Stripe from "stripe"

const TEST_PRICE = 100 // $1

const USERS = [
  {
    userId: "user_123",
    customerId: "",
    email: "test_user@mail.com",
    firstName: "Test",
    lastName: "User",
  },
]

@Injectable()
export class StripeService {
  stripe = new Stripe(appConfigs.stripe.secretKey, { apiVersion: "2023-10-16" })

  async getCustomerByUserId(userId: string) {
    const user = USERS.find((user) => user.userId === userId)
    const { email, firstName, lastName } = user

    let customerId: null | string = null

    const items = (await this.stripe.customers.list({ email })).data

    if (items.length > 0) {
      customerId = items[0].id
    } else {
      const { id } = await this.stripe.customers.create({ email, name: `${firstName} ${lastName}` })
      customerId = id
    }

    return customerId
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      appConfigs.stripe.webhookSecret,
    )

    console.log(event)
  }

  async createCheckoutSession(userId: string) {
    const customer = await this.getCustomerByUserId(userId)

    const session = await this.stripe.checkout.sessions.create({
      customer,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: { name: `SOME DESCRIPTION (PAYMENT FOR)` },
            unit_amount: TEST_PRICE,
          },
          quantity: 1,
        },
      ],
      // payment_intent_data: { metadata: { sessionId } },
      success_url: "https://www.google.com/",
      cancel_url: "https://www.google.com/",
    })

    const { url } = session
    if (!url) throw new InternalServerErrorException("Checkout session initialization error")

    return url
  }
}

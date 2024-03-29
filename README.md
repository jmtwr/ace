## Testing Local Stripe

1. install stripe cli https://stripe.com/docs/stripe-cli
2. run `stripe login`
3. run `stripe listen --skip-verify --forward-to localhost:3040/api/v1/stripe/webhook`
4. copy webhook secret from cli to `.env` (`STRIPE_WEBHOOK_SECRET`)
5. start / restart backend

## Build app

1. The `.env' file describes the necessary env vars.
   - `STRIPE_PUBLIC_KEY` & `STRIPE_SECRET_KEY` > can be found in `https://dashboard.stripe.com/apikeys`
   - `STRIPE_WEBHOOK_SECRET` > `https://stripe.com/docs/webhooks`, should register the webhook using the following path `domain/api/v1/stripe/webhook`
2. run `yarn build` > to build application
3. run `node main.js` > to boostrap application

## Test substracting 1 EUR from user card

1. `curl domain/api/v1/stripe/test` > will create checkout session and return redirect link to stripe
2. `https://dashboard.stripe.com/payments` > check success/fail payments

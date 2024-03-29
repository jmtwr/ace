import * as dotenv from "dotenv-flow"

dotenv.config()

const strOrFail = (key: string, defaultValue?: string) => {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

const intOrFail = (key: string, defaultValue?: number) => {
  const value = strOrFail(key, defaultValue?.toString())
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Invalid environment variable: ${key}`)
  }
  return parsed
}

export const appConfigs = {
  port: intOrFail("PORT", 3000),
  stripe: {
    publicKey: strOrFail("STRIPE_PUBLIC_KEY"),
    secretKey: strOrFail("STRIPE_SECRET_KEY"),
    webhookSecret: strOrFail("STRIPE_WEBHOOK_SECRET"),
  },
  corsOrigin: strOrFail("CORS_ORIGIN", "*"),
}

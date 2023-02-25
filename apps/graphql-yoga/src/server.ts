import { createYoga, LogLevel } from "graphql-yoga"
import { createServer } from "node:http"
import { renderGraphiQL } from "@graphql-yoga/render-graphiql"
// the schema/index.ts is generated automatically via `npm run cli:generateindex`
import { schema } from "src/schema/index.js"
import { ResolveUserFn, useGenericAuth } from "@envelop/generic-auth"
import { getUser } from "src/auth"
import { JWTPayload } from "jose"

const resolveUserFn: ResolveUserFn<JWTPayload> = async (context) => {
  // Here you can implement any custom sync/async code, and use the context built so far in Envelop and the HTTP request
  // to find the current user.
  // Common practice is to use a JWT token here, validate it, and use the payload as-is, or fetch the user from an external services.
  // Make sure to either return `null` or the user object.

  try {
    const user = await getUser(context.req)

    if (!user) {
      return null
    }

    return user
  } catch (e) {
    return null
  }
}

const yoga = createYoga({
  schema,
  logging: (process.env.YOGA_LOGGER as LogLevel) || "warn",
  landingPage: false,
  graphiql: process.env.NODE_ENV != "production",
  renderGraphiQL,
  plugins: [
    useGenericAuth({
      resolveUserFn,
      mode: "resolve-only",
    }),
  ],
})
const server = createServer(yoga)

server.listen({ port: process.env.YOGA_PORT || 4000 })

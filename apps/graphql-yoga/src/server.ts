import { createYoga, LogLevel } from "graphql-yoga"
import { createServer } from "node:http"
import { renderGraphiQL } from "@graphql-yoga/render-graphiql"
// the schema/index.ts is generated automatically via `npm run cli:generateindex`
import { schema } from "src/schema/index.js"
import { initContextCache } from "@pothos/core"

const yoga = createYoga({
  schema,
  logging: (process.env.YOGA_LOGGER as LogLevel) || "warn",
  landingPage: false,
  graphiql: process.env.NODE_ENV != "production",
  renderGraphiQL,
  plugins: [],
  context: async ({ request }) => {
    return {
      ...initContextCache(),
    }
  },
})
const server = createServer(yoga)

server.listen({ port: process.env.YOGA_PORT || 4000 })

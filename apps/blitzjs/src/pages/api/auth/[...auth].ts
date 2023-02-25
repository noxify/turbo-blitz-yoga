import { passportAuth } from "@blitzjs/auth"
import { api } from "src/blitz-server"
import { Issuer, Strategy as OpenIdStrategy } from "openid-client"
import { User, db } from "@acme/db"

const issuer = new Issuer({
  issuer: "http://localhost:8080",
  authorization_endpoint: "http://localhost:8080/authorize",
  token_endpoint: "http://localhost:8080/token",
  userinfo_endpoint: "http://localhost:8080/userinfo",
  jwks_uri: "http://localhost:8080/jwks",
})

const client1 = new issuer.Client({
  client_id: "member",
  client_secret: "client_secret",
  redirect_uris: ["http://localhost:3000/api/auth/mock1/callback"],
})

const client2 = new issuer.Client({
  client_id: "admin",
  client_secret: "client_secret2",
  redirect_uris: ["http://localhost:3000/api/auth/mock2/callback"],
})

export default api(
  passportAuth({
    successRedirectUrl: "/",
    errorRedirectUrl: "/",
    strategies: [
      {
        name: "mock1",
        strategy: new OpenIdStrategy(
          { client: client1, params: { scope: "openid email profile" } },
          // Available callback parameters
          // https://github.com/panva/node-openid-client/blob/main/docs/README.md#strategy
          async (
            _token: any,
            profile: any,
            done: (
              arg0: undefined,
              arg1: { publicData: { userId: number; roles: string[]; source: string } }
            ) => void
          ) => {
            let user: User
            try {
              user = await db.user.findFirstOrThrow({ where: { name: { equals: "user1" } } })
            } catch (e) {
              user = await db.user.create({
                data: {
                  email: "dummy1@email.com",
                  name: "user1",
                  role: "member",
                },
              })
            }

            const publicData = {
              userId: user.id,
              roles: [user.role],
              source: "blitz_app",
            }
            done(undefined, { publicData })
          }
        ),
      },
      {
        name: "mock2",
        strategy: new OpenIdStrategy(
          { client: client2 },
          // Available callback parameters
          // https://github.com/panva/node-openid-client/blob/main/docs/README.md#strategy
          async (
            _token: any,
            profile: any,
            done: (
              arg0: undefined,
              arg1: { publicData: { userId: number; roles: string[]; source: string } }
            ) => void
          ) => {
            let user: User
            try {
              user = await db.user.findFirstOrThrow({ where: { name: { equals: "user2" } } })
            } catch (e) {
              user = await db.user.create({
                data: {
                  email: "dummy2@email.com",
                  name: "user2",
                  role: "admin",
                },
              })
            }

            const publicData = {
              userId: user.id,
              roles: [user.role],
              source: "blitz_app",
            }
            done(undefined, { publicData })
          }
        ),
      },
    ],
  })
)

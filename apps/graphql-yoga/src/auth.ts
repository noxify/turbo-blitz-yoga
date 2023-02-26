import { db, User } from "@acme/db"
import { JWTPayload, createRemoteJWKSet, jwtVerify } from "jose"
import { SessionContext } from "src/builder"

export async function getUser(req: any): Promise<SessionContext | undefined> {
  const authHeader = req.headers.get("authorization")

  const token = authHeader?.replace("Bearer ", "")
  const result = await isTokenValid(token)

  let user: Partial<User>

  if (!result.error) {
    try {
      user = await db.user.findFirstOrThrow({ where: { name: { equals: "apiuser2" } } })
    } catch (e) {
      user = await db.user.create({
        data: {
          email: "normalapiuser@email.com",
          name: "apiuser2",
          role: "member",
        },
      })
    }
  } else {
    user = {
      id: 0,
      role: "invalid",
    }
  }

  const publicData: SessionContext = {
    userId: user.id as number,
    role: user.role as string,
    $isAuthorized: () => !result.error,
  }

  return {
    ...publicData,
  }
}

const JWKS = createRemoteJWKSet(new URL(`http://localhost:8080/jwks`))

export async function isTokenValid(token: string): Promise<{ decoded?: JWTPayload; error?: any }> {
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        algorithms: ["RS256"],
      })

      return { decoded: payload }
    } catch (e) {
      return { error: "invalid_token" }
    }
  }

  return { error: "no_token" }
}

import { JWTPayload, createRemoteJWKSet, jwtVerify } from "jose"

export async function getUser(req: any): Promise<JWTPayload | null | undefined> {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "")
    const result = await isTokenValid(token)

    if (result.decoded) {
      return {
        ...result.decoded,
        authenticated: true,
      }
    }

    return null
  }
}

const JWKS = createRemoteJWKSet(
  new URL(
    `https://${process.env.AUTH_ISSUER}/auth/realms/${process.env.AUTH_NAMESPACE}/protocol/openid-connect/certs`
  )
)

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

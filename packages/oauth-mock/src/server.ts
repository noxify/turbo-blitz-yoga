import basicAuth from "basic-auth"
import { OAuth2Server } from "oauth2-mock-server"
let server = new OAuth2Server()

// Generate a new RSA key and add it to the keystore
await server.issuer.keys.generate("RS256")

// Start the server
await server.start(8080, "localhost")
console.log("Issuer URL:", server.issuer.url) // -> http://localhost:8080

server.service.once("beforeTokenSigning", (token, req) => {
  const credentials = basicAuth(req)
  //console.log({ body: req.body, credentials })
  token.payload.client_id = credentials?.name || req.body.client_id
})

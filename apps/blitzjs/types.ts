import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized
    PublicData: {
      userId: User["id"]
      role: string
    }
  }
}

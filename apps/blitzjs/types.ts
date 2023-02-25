import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"
import { AnyMongoAbility, Roles } from "@acme/permissions"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: AnyMongoAbility
    PublicData: {
      userId: User["id"]
      role: string
    }
  }
}

import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"
import { Roles } from "@acme/permissions"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Roles>
    PublicData: {
      userId: User["id"]
      role: Roles
    }
  }
}

import { User } from "@acme/db"
import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
} from "@casl/ability"

type DefinePermissions = (
  user: Partial<User>,
  builder: AbilityBuilder<AnyMongoAbility>,
) => void

export type Roles = "member" | "admin"

export const rolePermissions: Record<Roles, DefinePermissions> = {
  member(user, { can }) {
    can("update", "User", { id: user.id })
    can("read", "Todo")
    can("create", "Todo")
    can("update", "Todo", { userId: user.id })
    can("delete", "Todo", { userId: user.id })
  },
  admin(user, { can }) {
    can("manage", "all")
  },
}

export const defineAbilitiesFor = (user: Partial<User>) => {
  const builder = new AbilityBuilder(createMongoAbility)

  if (typeof rolePermissions[user.role as Roles] === "function") {
    rolePermissions[user.role as Roles](user, builder)
  } else {
    throw new Error(
      `Trying to use unknown role "${user.role || "unknown role"}"`,
    )
  }

  return builder.build()
}

export { subject, type AnyMongoAbility } from "@casl/ability"

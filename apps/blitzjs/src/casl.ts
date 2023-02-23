import { Todo, User } from "@acme/db"
import { AnyMongoAbility, subject } from "@acme/permissions"
import { SessionContext } from "@blitzjs/auth"

type CaslIsAuthorizedArgs = {
  ctx: any
  args: [action: string, type: "Todo" | "User", object?: Todo | User]
}

export async function caslIsAuthorized({ ctx, args }: CaslIsAuthorizedArgs) {
  const [action, type, object] = args
  const user = ctx.session as SessionContext
  const ability = (await user.$getPrivateData()).ability as AnyMongoAbility

  return ability.can(action, object ? subject(type, object) : type)
}

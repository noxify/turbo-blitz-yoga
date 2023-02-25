import { Todo, User } from "@acme/db"
import { defineAbilitiesFor, subject } from "@acme/permissions"
import { SessionContext } from "@blitzjs/auth"
import { AuthorizationError } from "blitz"

type CheckPermissionArgs = {
  action: string
  resource: string
  ctx: any
  input?: any
}

export function hasPermission({ action, resource, ctx, input }: CheckPermissionArgs) {
  const user = ctx.session as SessionContext
  const ability = defineAbilitiesFor({
    id: user.userId as number,
    role: user.role as string,
  })

  return ability.can(action, input ? subject(resource, input) : resource)
}

// Inspired by
// https://github.com/ntgussoni/blitz-guard/blob/main/packages/core/src/authorize.ts#L20
export const checkPermissionPipe =
  (action: string, resource: string) => async (input: any, ctx: any) => {
    console.log({ action, resource, input, ctx })
    const user = ctx.session as SessionContext
    const ability = defineAbilitiesFor({
      id: user.userId as number,
      role: user.role as string,
    })

    const isAuthorized = ability.can(action, input ? subject(resource, input) : resource)

    if (!isAuthorized) throw new AuthorizationError("You have not the permission to do this.")

    return input
  }

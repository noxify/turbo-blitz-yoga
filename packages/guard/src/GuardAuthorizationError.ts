import { IGuardAuthErrorProps, IGuardAuthorizationError, IRule } from "./types"

export class AuthorizationError extends Error {
  name = "AuthorizationError"
  statusCode = 403
  constructor(message = "You are not authorized to access this") {
    super(message)
  }
  get _clearStack() {
    return true
  }
}
class GuardAuthorizationError<IResource, IAbility>
  extends AuthorizationError
  implements IGuardAuthorizationError<IResource, IAbility>
{
  name = "GuardAuthorizationError"
  rule: Pick<IRule<IResource, IAbility>, "ability" | "resource">

  constructor({
    ability,
    resource,
    reason,
  }: IGuardAuthErrorProps<IResource, IAbility>) {
    super(reason || "You are not authorized to access this")
    this.rule = { ability, resource }
  }
}

export { GuardAuthorizationError }

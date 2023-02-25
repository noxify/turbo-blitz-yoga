import { GuardAuthorizationError } from "./GuardAuthorizationError"
import { IAuthorize, IAuthorizePipe, IGuard } from "./types"

export const authorize = <IResource, IAbility>(
  GuardInstance: IGuard<IResource, IAbility>,
): IAuthorize<IResource, IAbility> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  return (ability, resource, resolver) => async (args, ctx) => {
    const { can: isAuthorized, reason } = await GuardInstance.can(
      ability,
      resource,
      ctx,
      args,
    )

    if (!isAuthorized)
      throw new GuardAuthorizationError<IResource, IAbility>({
        ability,
        resource,
        reason,
      })

    return resolver(args, ctx)
  }
}

export const authorizePipe = <IResource, IAbility>(
  GuardInstance: IGuard<IResource, IAbility>,
): IAuthorizePipe<IResource, IAbility> => {
  return (ability, resource) => async (input, ctx) => {
    const { can: isAuthorized, reason } = await GuardInstance.can(
      ability,
      resource,
      ctx,
      input,
    )

    if (!isAuthorized)
      throw new GuardAuthorizationError<IResource, IAbility>({
        ability,
        resource,
        reason,
      })

    return input
  }
}

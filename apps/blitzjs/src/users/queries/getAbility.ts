import { defineAbilitiesFor, subject } from "@acme/permissions"
import { Ctx } from "blitz"

const getAbility = async (rules: any[], ctx: Ctx): Promise<boolean[]> => {
  const user = ctx.session
  const ability = defineAbilitiesFor({
    id: user.userId as number,
    role: user.role as string,
  })

  console.log({ user: user.userId })

  const promiseResult = rules.map(
    ([action, resource, args = {}]) =>
      ability.can(action, args ? subject(resource, args) : resource) as boolean
  )

  return Promise.all(promiseResult)
}

export default getAbility

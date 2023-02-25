import { db, Prisma } from "@acme/db"
import { GuardBuilder } from "."

type ExtendedResourceTypes = Prisma.ModelName
type ExtendedAbilityTypes = ""

const GuardHandler = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")

    if (ctx.session.$isAuthorized() == true) {
      switch (ctx.session.role) {
        case "admin":
          can("manage", "all")
          break

        case "member":
        default:
          can("create", "Todo")
          can("read", "Todo")
          can("update", "Todo", async (_args) => {
            return (
              (await db.todo.count({
                where: {
                  //userId: { not: { equals: ctx.session.userId } },
                  userId: { equals: ctx.session.userId },
                  id: { equals: _args.id as number },
                },
              })) === 1
            )
          }).reason(
            "You have not the permission to update todos from other users",
          )

          break
      }
    }
  },
)

export { GuardHandler }

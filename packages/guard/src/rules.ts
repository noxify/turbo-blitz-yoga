import { db, Prisma, Todo } from "@acme/db"
import { GuardBuilder } from "."

type ExtendedResourceTypes = Prisma.ModelName
type ExtendedAbilityTypes = ""

const GuardHandler = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")

    if (ctx.session.$isAuthorized() == true) {
      if (ctx.session.role === "admin") {
        can("manage", "all")
      } else {
        can("create", "Todo")
        can("read", "Todo")
        can("update", "Todo", async (todoRecord: Todo) => {
          return (
            (await db.todo.count({
              where: {
                userId: { equals: ctx.session.userId },
                id: { equals: todoRecord.id },
              },
            })) === 1
          )
        })
      }
    }
  },
)

export { GuardHandler }

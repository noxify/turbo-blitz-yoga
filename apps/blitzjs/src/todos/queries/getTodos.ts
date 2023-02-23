import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetTodosInput
  extends Pick<Prisma.TodoFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTodosInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: todos,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.todo.count({ where }),
      query: (paginateArgs) => db.todo.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      todos,
      nextPage,
      hasMore,
      count,
    }
  }
)

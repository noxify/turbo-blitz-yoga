import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateTodo = z.object({
  title: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTodo), resolver.authorize(), async (input, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const todo = await db.todo.create({ data: { ...input, userId: ctx.session.userId } })

  return todo
})

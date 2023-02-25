import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTodo = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTodo), resolver.authorize(), async ({ id }) => {
  const todo = await db.todo.findFirst({ where: { id } })
  if (!todo) throw new NotFoundError()

  return todo
})

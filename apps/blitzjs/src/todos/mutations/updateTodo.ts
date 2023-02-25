import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GuardHandler } from "@acme/guard"
import { z } from "zod"
const UpdateTodo = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTodo),
  resolver.authorize(),
  GuardHandler.authorizePipe("update", "Todo"),
  //checkPermissionPipe("update", "Todo"),
  async ({ id, ...data }) => {
    const updateTodo = await db.todo.update({ where: { id }, data })

    return updateTodo
  }
)

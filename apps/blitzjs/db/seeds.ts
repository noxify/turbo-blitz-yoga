import { SecurePassword } from "@blitzjs/auth"
import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }

  const hashedPassword = await SecurePassword.hash("123456")

  await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      hashedPassword,
      role: "admin",
    },
  })

  await db.user.create({
    data: {
      name: "Normal User",
      email: "user@example.com",
      hashedPassword,
      role: "member",
    },
  })
}

export default seed

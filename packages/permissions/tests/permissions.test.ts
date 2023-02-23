import { Todo, User } from "@acme/db"
import { subject } from "@casl/ability"
import { describe, expect, test } from "vitest"
import { defineAbilitiesFor } from "../src"

const admin: User = {
  id: 1,
  name: "Admin User",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "admin.user@example.com",
  hashedPassword: "xxx",
}

const member: User = {
  id: 2,
  name: "Normal User",
  role: "member",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "normal.user@example.com",
  hashedPassword: "xxx",
}

const todo1: Todo = {
  id: 1,
  userId: 1,
  title: "Todo 1",
  description: "Desc Todo 1",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const todo2: Todo = {
  id: 2,
  userId: 2,
  title: "Todo 2",
  description: "Desc Todo 2",
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("Permission Tests", () => {
  describe("As Admin", () => {
    test("user can do anything", () => {
      expect(defineAbilitiesFor(admin).can("manage", "all")).toBeTruthy()
    })

    test("user can create todo", () => {
      expect(defineAbilitiesFor(admin).can("create", "Todo")).toBeTruthy()
    })

    test("user can update todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "update",
        subject("Todo", todo2),
      )
      expect(expectation).toBeTruthy()
    })

    test("user can delete todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "delete",
        subject("Todo", todo2),
      )
      expect(expectation).toBeTruthy()
    })
  })

  describe("As Member", () => {
    test("user cannot do anything", () => {
      expect(defineAbilitiesFor(member).cannot("manage", "all")).toBeTruthy()
    })

    test("user can create todo", () => {
      expect(defineAbilitiesFor(member).can("create", "Todo")).toBeTruthy()
    })

    test("user can update todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "update",
        subject("Todo", todo2),
      )
      expect(expectation).toBeTruthy()
    })

    test("user cannot update todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "update",
        subject("Todo", todo1),
      )
      expect(expectation).toBeFalsy()
    })

    test("user can delete todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "delete",
        subject("Todo", todo2),
      )
      expect(expectation).toBeTruthy()
    })

    test("user cannot delete todo", () => {
      const expectation = defineAbilitiesFor(member).can(
        "delete",
        subject("Todo", todo1),
      )
      expect(expectation).toBeFalsy()
    })
  })
})

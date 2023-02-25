import { db } from "@acme/db"

import { builder, IntFieldComparison, SortDirection, StringFieldComparison } from "src/builder.js"

const FilterInput = builder.inputRef("TodoFilterInput").implement({
  fields: (t) => ({
    id: t.field({ type: IntFieldComparison }),
    title: t.field({ type: StringFieldComparison }),
    description: t.field({ type: IntFieldComparison }),
    AND: t.field({ type: [FilterInput] }),
    OR: t.field({ type: [FilterInput] }),
  }),
})

export const SortFields = builder.enumType("TodoSortFields", {
  values: ["id", "title", "description"] as const,
})

const SortingInput = builder.inputType("TodoSortOrder", {
  fields: (t) => ({
    field: t.field({
      type: SortFields,
    }),
    direction: t.field({
      type: SortDirection,
    }),
  }),
})

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    //todos: t.relation("todos"),
  }),
})

builder.prismaObject("Todo", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    // not sure why this throws an ts error
    // @ts-expect-error
    title: t.exposeString("title"),
    // not sure why this throws an ts error
    // @ts-expect-error
    description: t.exposeString("description"),
    user: t.relation("user", {}),
  }),
})

builder.queryFields((t) => ({
  todos: t.prismaConnection({
    type: "Todo",
    cursor: "id",
    args: {
      filter: t.arg({ type: FilterInput, required: false }),
      sorting: t.arg({ type: [SortingInput], required: false }),
    },
    totalCount: (connection, args, context, info) => {
      return db.todo.count({ where: args.filter || {} })
    },
    resolve: function (query, parent, args, context, info) {
      const customOrderBy = {}
      for (const orderElement of args.sorting || []) {
        customOrderBy[orderElement.field as string] = orderElement.direction?.toLowerCase()
      }

      return db.todo.findMany({
        ...query,
        where: args.filter || {},

        orderBy: customOrderBy,
      })
    },
  }),
  todo: t.prismaField({
    type: "Todo",
    args: {
      id: t.arg({ type: "Int", required: true }),
    },
    resolve(query, parent, args, context, info) {
      return db.todo.findFirstOrThrow({
        ...query,
        where: {
          id: { equals: args.id },
        },
      })
    },
  }),
}))

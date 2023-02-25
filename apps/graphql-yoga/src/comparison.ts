import { builder } from "src/builder.js"
import { InputFieldRef } from "@pothos/core"

type AllowedOperators =
  | "is"
  | "isNot"
  | "equals"
  | "not"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "in"
  | "notIn"
  | "startsWith"
  | "endsWith"

const generateComparison = ({
  name,
  type,
  allowedOperators,
}: {
  name?: string
  type: any
  allowedOperators: AllowedOperators[]
}) => {
  return builder.inputType(`${name || type}FieldComparison`, {
    fields: (t) => {
      const operators: { [key: string]: InputFieldRef<any, "InputObject"> } = {
        is: t.boolean({}),
        isNot: t.boolean({}),
        equals: t.field({ type }),
        not: t.field({ type }),
        gt: t.field({ type }),
        gte: t.field({ type }),
        lt: t.field({ type }),
        lte: t.field({ type }),
        contains: t.field({ type }),
        startsWith: t.field({ type }),
        endsWith: t.field({ type }),
        in: t.field({ type: [type] }),
        notIn: t.field({ type: [type] }),
      }

      const operatorKeys = allowedOperators || Object.keys(operators)

      const availableOperators: {
        [key: string]: InputFieldRef<any, "InputObject">
      } = {}

      for (const operatorKey of operatorKeys) {
        //@ts-expect-error
        availableOperators[operatorKey] = operators[operatorKey]
      }

      return availableOperators
    },
  })
}

export const createStringFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "String",
    allowedOperators: ["equals", "not", "contains", "in", "notIn", "startsWith", "endsWith"],
  })
}

export const createIntFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "Int",
    allowedOperators: ["equals", "not", "lt", "lte", "gt", "gte", "in", "notIn"],
  })
}

export const createFloatFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "Float",
    allowedOperators: ["equals", "not", "lt", "lte", "gt", "gte", "in", "notIn"],
  })
}

export const createIDFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "ID",
    allowedOperators: ["equals", "not", "in", "notIn"],
  })
}

export const createBooleanFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "Boolean",
    allowedOperators: ["is", "isNot"],
  })
}

export const createDateFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "Date",
    allowedOperators: ["equals", "not", "lt", "lte", "gt", "gte"],
  })
}

export const createDateTimeFieldComparison = ({ name }: { name?: string }) => {
  return generateComparison({
    name,
    type: "DateTime",
    allowedOperators: ["equals", "not", "lt", "lte", "gt", "gte"],
  })
}

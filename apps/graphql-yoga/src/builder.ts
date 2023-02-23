import { DateResolver, DateTimeResolver } from "graphql-scalars"
import SchemaBuilder from "@pothos/core"
import {
  createStringFieldComparison,
  createIntFieldComparison,
  createDateFieldComparison,
  createDateTimeFieldComparison,
  createFloatFieldComparison,
  createIDFieldComparison,
  createBooleanFieldComparison,
} from "src/comparison.js"

export type Context = {}

export const builder = new SchemaBuilder<{
  Context: Context
  Scalars: {
    ID: {
      Output: number | string
      Input: string
    }
    Date: {
      Output: Date
      Input: Date
    }
    DateTime: {
      Output: Date
      Input: Date
    }
  }
}>({
  plugins: [],
})

builder.queryType()

export const SortDirection = builder.enumType("SortDirection", {
  values: ["ASC", "DESC"] as const,
})

export const Paging = builder.inputType("Paging", {
  fields: (t) => ({
    perPage: t.int({ defaultValue: 100 }),
    skip: t.int({ defaultValue: 0 }),
  }),
})

export const StringFieldComparison = createStringFieldComparison({})
export const IntFieldComparison = createIntFieldComparison({})
export const FloatFieldComparison = createFloatFieldComparison({})
export const BooleanFieldComparison = createBooleanFieldComparison({})
export const DateFieldComparison = createDateFieldComparison({})
export const DateTimeFieldComparison = createDateTimeFieldComparison({})
export const IDFieldComparison = createIDFieldComparison({})

builder.addScalarType("Date", DateResolver, {})
builder.addScalarType("DateTime", DateTimeResolver, {})

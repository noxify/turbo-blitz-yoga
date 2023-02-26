import { DateResolver, DateTimeResolver } from "graphql-scalars"
import SchemaBuilder from "@pothos/core"
import PrismaPlugin from "@pothos/plugin-prisma"
import type PrismaTypes from "@acme/db/prisma/pothos-types"
import RelayPlugin from "@pothos/plugin-relay"

import {
  createStringFieldComparison,
  createIntFieldComparison,
  createDateFieldComparison,
  createDateTimeFieldComparison,
  createFloatFieldComparison,
  createIDFieldComparison,
  createBooleanFieldComparison,
} from "src/comparison.js"

import ScopeAuthPlugin from "@pothos/plugin-scope-auth"
import { db, Prisma } from "@acme/db"
import { createGraphQLError } from "graphql-yoga"
import { AbilityType, GuardHandler } from "@acme/guard"

export type SessionContext = {
  userId: number
  role: string
  $isAuthorized: () => boolean
}
export type Ctx = {
  session: SessionContext
}

export const builder = new SchemaBuilder<{
  Context: Ctx
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
  AuthScopes: {
    isAuthorized: boolean
    hasPermission: {
      action: AbilityType<"">
      resource: Prisma.ModelName
      query?: any
    }
  }

  PrismaTypes: PrismaTypes
}>({
  plugins: [RelayPlugin, PrismaPlugin, ScopeAuthPlugin],
  prisma: {
    client: db,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    exposeDescriptions: false,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
    dmmf: Prisma.dmmf,
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: "omit",
    cursorType: "String",
  },
  scopeAuthOptions: {
    runScopesOnType: true,
  },
  authScopes: async (context) => ({
    isAuthorized: async () => {
      if (!context.session || !context.session.$isAuthorized()) {
        throw createGraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: {
              status: 401,
            },
          },
        })
      }

      return true
    },

    hasPermission: async ({ action, resource, query }) => {
      const { can } = await GuardHandler.can(action, resource, context, query)

      if (!can) {
        throw createGraphQLError("Forbidden", {
          extensions: {
            code: "FORBIDDEN",
            http: {
              status: 403,
            },
          },
        })
      }

      return can
    },
  }),
})

builder.queryType()
builder.mutationType()

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

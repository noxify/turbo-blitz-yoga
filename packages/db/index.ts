export * from "@prisma/client"
export { PrismaClient } from "@prisma/client"
export { db }

import { PrismaClient } from "@prisma/client"
import { spawn } from "cross-spawn"
import which from "npm-which"

declare global {
  var _prismaClient: any
}

export interface Constructor<T = unknown> {
  new (...args: never[]): T
}

export interface EnhancedPrismaClientAddedMethods {
  $reset: () => Promise<void>
}

export interface EnhancedPrismaClientConstructor<
  TPrismaClientCtor extends Constructor,
> {
  new (
    ...args: ConstructorParameters<TPrismaClientCtor>
  ): InstanceType<TPrismaClientCtor> & EnhancedPrismaClientAddedMethods
}

export const enhancePrisma = <TPrismaClientCtor extends Constructor>(
  client: TPrismaClientCtor,
): EnhancedPrismaClientConstructor<TPrismaClientCtor> => {
  return new Proxy(
    client as EnhancedPrismaClientConstructor<TPrismaClientCtor>,
    {
      construct(target, args) {
        if (typeof window !== "undefined") {
          // Return object with $use method if in the browser
          // Skip in Jest tests because window is defined in Jest tests
          return { $use: () => {} }
        }

        if (!globalThis._prismaClient) {
          const client = new target(...(args as any))

          client.$reset = async function reset() {
            if (process.env.NODE_ENV === "production") {
              throw new Error(
                "You are calling db.$reset() in a production environment. We think you probably didn't mean to do that, so we are throwing this error instead of destroying your life's work.",
              )
            }
            const prismaBin = which(process.cwd()).sync("prisma")
            await new Promise((res, rej) => {
              const process = spawn(
                prismaBin,
                ["migrate", "reset", "--force", "--skip-generate"],
                {
                  stdio: "ignore",
                },
              )
              process.on("exit", (code) =>
                code === 0
                  ? res(0)
                  : rej(new Error(`db.$reset() failed with code ${code}`)),
              )
            })
            globalThis._prismaClient.$disconnect()
          }

          globalThis._prismaClient = client
        }

        return globalThis._prismaClient
      },
    },
  )
}

const EnhancedPrisma = enhancePrisma(PrismaClient)
const db = new EnhancedPrisma()

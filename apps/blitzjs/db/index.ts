import { enhancePrisma } from "blitz"
import { PrismaClient } from "@acme/db"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@acme/db"
const db = new EnhancedPrisma()
export default db

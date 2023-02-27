# Turbo Repo w/ BlitzJS & GraphQL-Yoga ( Pothos )

## Getting started

```bash
git clone <repo>
cd <local_directory>
pnpm i
cp .env.example .env.local
# update .env.local as needed
pnpm run db:migrate:dev
pnpm run dev
```

## What's included?

- BlitzJS V2
- GraphQL-Yoga (v3)) with Pothos
- Forked version of blitz-guard
- OAuth Mock Server
- Shared Prisma schema & client

## Default Database Engine

Currently prisma uses SQLite as database engine.

If you want to use something else, you have to

- change the `DATABASE_URL` inside the `/.env`
- Delete the `migrations` directory in `/packages/db/prisma`
- Update the database provider in `/packages/db/prisma/schema.prisma`
- Run `pnpm run db:migrate:dev`

## References

The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

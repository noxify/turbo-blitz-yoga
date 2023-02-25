/* eslint-disable */
import type { Prisma, User, Session, Token, Todo } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        RelationName: "todos" | "tokens" | "sessions";
        ListRelations: "todos" | "tokens" | "sessions";
        Relations: {
            todos: {
                Shape: Todo[];
                Types: PrismaTypes["Todo"];
            };
            tokens: {
                Shape: Token[];
                Types: PrismaTypes["Token"];
            };
            sessions: {
                Shape: Session[];
                Types: PrismaTypes["Session"];
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User | null;
                Types: PrismaTypes["User"];
            };
        };
    };
    Token: {
        Name: "Token";
        Shape: Token;
        Include: Prisma.TokenInclude;
        Select: Prisma.TokenSelect;
        OrderBy: Prisma.TokenOrderByWithRelationInput;
        WhereUnique: Prisma.TokenWhereUniqueInput;
        Where: Prisma.TokenWhereInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
    Todo: {
        Name: "Todo";
        Shape: Todo;
        Include: Prisma.TodoInclude;
        Select: Prisma.TodoSelect;
        OrderBy: Prisma.TodoOrderByWithRelationInput;
        WhereUnique: Prisma.TodoWhereUniqueInput;
        Where: Prisma.TodoWhereInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
}
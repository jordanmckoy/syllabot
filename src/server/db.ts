import { Prisma, PrismaClient, Unit } from "@prisma/client";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const vectorStore = PrismaVectorStore.withModel<Unit>(prisma).create(
    new OpenAIEmbeddings(
        {
            openAIApiKey: process.env.OPENAI_API_KEY,
        }
    ),
    {
        prisma: Prisma,
        tableName: "Unit",
        vectorColumnName: "vector",
        columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
        },
    }
);
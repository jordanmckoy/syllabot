import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Prisma, Document } from "@prisma/client";
import { db } from "../db";
import { env } from "~/env.mjs";

const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(
        {
            openAIApiKey: env.OPENAI_KEY,
        }
    ),
    {
        prisma: Prisma,
        tableName: "Document",
        vectorColumnName: "vector",
        columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
        },
    }
);

export async function addToVectorStore(content: string, unitId: string) {
    const documents = [
        {
            content: content,
            unitId: unitId,
        }
    ]

    vectorStore.addModels(
        await db.$transaction(
            documents.map((document) => db.document.create({ data: document }))
        )
    );
}
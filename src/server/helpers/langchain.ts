import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { Prisma, Unit } from '@prisma/client';
import { db, redis } from '~/server/db';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { env } from '~/env.mjs';
import { PromptTemplate } from "langchain/prompts";
import {
    RunnableSequence,
    RunnablePassthrough,
} from "langchain/schema/runnable";
import { Document } from "langchain/document";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";

const vectorStore = PrismaVectorStore.withModel<Unit>(db).create(
    new OpenAIEmbeddings(
        {
            openAIApiKey: env.OPENAI_KEY,
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

const retriever = vectorStore.asRetriever();

const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate
);

const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
    const serializedDocs = docs.map((doc) => doc.pageContent);
    return serializedDocs.join(separator);
};

const formatChatHistory = (chatHistory: [string, string][]) => {
    const formattedDialogueTurns = chatHistory.map(
        (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    );
    return formattedDialogueTurns.join("\n");
};

type ConversationalRetrievalQAChainInput = {
    question: string;
    chat_history: [string, string][];
};

type AiQuery = {
    input: string;
    userId: string;
    unitId: string;
}

export async function getAiStream({ input, userId, unitId }: AiQuery) {

    try {
        const chatHistory = await redis.get(`chat_history:${userId}:${unitId}`);

        const chatHistoryArray = chatHistory ? JSON.parse(chatHistory) : [];

        const model = new ChatOpenAI({ openAIApiKey: env.OPENAI_KEY, streaming: true });

        const standaloneQuestionChain = RunnableSequence.from([
            {
                question: (input: ConversationalRetrievalQAChainInput) => input.question,
                chat_history: (input: ConversationalRetrievalQAChainInput) =>
                    formatChatHistory(input.chat_history),
            },
            CONDENSE_QUESTION_PROMPT,
            model,
            new StringOutputParser(),
        ]);

        const answerChain = RunnableSequence.from([
            {
                context: retriever.pipe(combineDocumentsFn),
                question: new RunnablePassthrough(),
            },
            ANSWER_PROMPT,
            model,
        ]);

        const conversationalRetrievalQAChain =
            standaloneQuestionChain.pipe(answerChain);

        const chain = conversationalRetrievalQAChain.stream({
            question: input,
            chat_history: chatHistoryArray,
        })

        return chain;
    } catch (error: any) {
        console.error(error);
        return new Error(error.message);
    }
}
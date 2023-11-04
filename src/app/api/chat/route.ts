import { NextRequest } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser, StringOutputParser } from 'langchain/schema/output_parser';
import { ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { prisma } from '@/server/db';
import { Unit, Prisma } from '@prisma/client';
import { env } from 'process';
import { formatDocumentsAsString } from 'langchain/util/document';
import { RunnablePassthrough, RunnableSequence } from 'langchain/schema/runnable';

const vectorStore = PrismaVectorStore.withModel<Unit>(prisma).create(
    new OpenAIEmbeddings(
        {
            openAIApiKey: env.OPENAI_API_KEY,
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

const retriever = vectorStore.asRetriever(1);

const SYSTEM_TEMPLATE = `
Answer questions within the context of of the given context information. 
Please stay within the specified topic and do not provide information about unrelated subjects. 
Try to keep the output relatively short without sacrificing accuracy.

----------------
{context}
`;
const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
];
const prompt = ChatPromptTemplate.fromMessages(messages);


const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const messages = body.messages as VercelChatMessage[] ?? [];
        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
        const currentMessageContent = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            openAIApiKey: env.OPENAI_API_KEY,
            streaming: true,
            modelName: "gpt-3.5-turbo"
        });

        const chain = RunnableSequence.from([
            {
                context: retriever.pipe(formatDocumentsAsString),
                question: new RunnablePassthrough()
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);

        const stream = await chain.stream(currentMessageContent);

        return new StreamingTextResponse(stream);

    } catch (error: any) {
        console.error(error);
        return new Response(error, { status: 500 });
    }
}
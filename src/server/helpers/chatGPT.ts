import OpenAI from "openai";
import { env } from "~/env.mjs";
import { redis } from "../db";
import { Socket } from "socket.io";
import { SocketMessage } from "~/pages/api/socket";

export type MessageParam = {
    prompt: string;
    userId: string;
    unitId: number;
};

export type ChatMessage = {
    role: "system" | "user" | "assistant" | "function";
    content: string | null;
};

const systemTemplate: ChatMessage = {
    role: "system",
    content: `You are a teacher specializing in a specific topic. Your first objective is to provide detailed notes and explanations in Markdown format for the specific learning objectives and content mentioned in the given course unit structure using the provided JSON data. Your notes should assist the student in understanding and clarifying any points, ensuring their comprehension and learning.
    Your second objective is to answer any questions that the student may ask on the topic you are currently conversing with them about. Please focus on answering questions directly related to the provided notes and avoid introducing additional information or going off-topic. 
    You have access to your memory. When answering questions, you can use Markdown as well to get your point across.
    The Unit May not be included in that case a question will be provided answer questions only when that case has happened and visa versa.
    Each Prompt has some meta data in the form of UserIds and Username and Unit Name
    `,
};

export async function getChatGPTResponse(
    params: MessageParam,
    socket: Socket
) {
    try {
        const message: SocketMessage = {
            id: Date.now().toString(),
            text: "",
            socketId: socket.id,
            userName: "ChatGPT",
            sender: "ChatGPT",
        }
        const client = new OpenAI({ apiKey: env.OPENAI_KEY });

        const history = await redis.get(`chatHistory:${params.userId}:${params.unitId}`);

        if (!history) {
            const stream = await client.chat.completions.create({
                messages: [systemTemplate, { role: "user", content: params.prompt }],
                model: "gpt-3.5-turbo",
                stream: true,
            });

            for await (const part of stream) {
                const token = part?.choices[0]?.delta;
                if (token && token.content) {
                    message.text = token.content;
                    socket.emit("new-message", message);
                }
            }

            await redis.set(
                `chatHistory:${params.userId}:${params.unitId}`,
                JSON.stringify([systemTemplate, { role: "user", content: params.prompt }])
            );
        } else {
            const messageHistory = history as ChatMessage[];

            messageHistory.push({ role: "user", content: params.prompt });

            const stream = await client.chat.completions.create({
                messages: messageHistory,
                model: "gpt-3.5-turbo",
                stream: true,
            });

            for await (const part of stream) {
                const token = part?.choices[0]?.delta;
                if (token && token.content) {
                    message.text = token.content;
                    socket.emit("new-message", message);
                }
            }

            await redis.set(
                `chatHistory:${params.userId}:${params.unitId}`,
                JSON.stringify([...messageHistory, { role: "user", content: params.prompt }]
                )
            );
        }
    } catch (error) {
        console.log(error);
    }
}

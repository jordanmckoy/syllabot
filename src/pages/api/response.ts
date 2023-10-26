import { ReadableStream } from 'web-streams-polyfill/ponyfill';
import { OpenAI } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from 'stream'
import { getAiStream } from '~/server/helpers/langchain';
import { z } from 'zod';

const requestSchema = z.object({
    question: z.string(),
    userId: z.string(),
    unitId: z.string(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {

            const body = JSON.parse(req.body);

            const data = await requestSchema.parseAsync(body);

            const completionStream = await getAiStream({
                input: data.question,
                userId: data.userId,
                unitId: data.unitId,
            })

            if (completionStream instanceof Error) {
                res.status(500).end("Error");
                return;
            }

            const stream = new ReadableStream({
                async start(controller) {
                    const encoder = new TextEncoder();
                    for await (const part of completionStream) {
                        const chunk = encoder.encode(part.content);
                        controller.enqueue(chunk);
                    }
                    controller.close();
                },
            });

            pipeline(stream, res, (error) => {
                if (error) console.error(error)
            })

        } catch (error: any) {
            console.error(error);
            res.status(500).end(error.message);
        }
    } else {
        res.status(405);
    }
};
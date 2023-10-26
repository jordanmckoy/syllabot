import { ReadableStream } from 'web-streams-polyfill/ponyfill';
import { OpenAI } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from 'stream'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_KEY,
            });

            const input = req.body;

            console.log(input);

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: input }],
                stream: true,
            });

            const stream = new ReadableStream({
                async start(controller) {
                    const encoder = new TextEncoder();

                    for await (const part of completion) {
                        const text = part.choices[0]?.delta.content ?? '';
                        const chunk = encoder.encode(text);
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
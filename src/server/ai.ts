// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { PromptTemplate } from "langchain/prompts"
// import { env } from "~/env.mjs";
// import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
// import { BufferMemory } from "langchain/memory";
// import { Unit } from "@prisma/client";
// import { LLMChain } from "langchain/chains";

// const memory = new BufferMemory({
//     chatHistory: new UpstashRedisChatMessageHistory({
//         sessionId: new Date().toISOString(),
//         sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
//         config: {
//             url: env.UPSTASH_URL,
//             token: env.UPSTASH_PASS,
//         },
//     }),
//     returnMessages: true,
//     memoryKey: "history",
// });

// const openAiModel = new ChatOpenAI({
//     modelName: "gpt-3.5-turbo",
//     temperature: 0,
//     openAIApiKey: env.OPENAI_KEY,
// });


// const template = `Please provide detailed notes and explanations, in Markdown format, for the specific learning objectives and content mentioned in the given course unit structure using the provided JSON data. Your answers should assist the student in understanding and clarifying any points within the notes, ensuring their comprehension and learning. Please focus on answering questions directly related to the provided notes and avoid introducing additional information or going off-topic.
// Here is the Json Data
// {input}
// `

// export async function askOpenAi(unit: Unit) {
//     const prompt = PromptTemplate.fromTemplate(template);

//     const chain = new LLMChain({
//         llm: openAiModel,
//         memory: memory,
//         prompt: prompt,
//     });

//     const result = await chain.run(JSON.stringify(unit));

//     return result;
// }

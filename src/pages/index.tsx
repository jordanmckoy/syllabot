import Head from "next/head";
import Dashboard from "./components/dashboard";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import ReactMarkdown from 'react-markdown';
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";

const topics = [
    "The Importance of the Physical Database",
    "Overview of Physical Storage Media",
    "Relationship Between Database Components",
    "Disk Performance Factors",
    "Data Transfer Time",
    "Optimization of Disk-Block Access",
    "RAID Technology",
    "File Organization and Record Format",
    "Data Storage Formats on Disk",
];

export default function Index() {
    const [question, setQuestion] = useState("");
    const [selectedTopic, setSelectedTopic] = useState(topics[0]);

    const response = api.palm.getPalmResponse.useQuery({ text: `Can you tell me more about ${selectedTopic}?` });

    useEffect(() => {
        if (response.data) {
            setQuestion(response.data);
        }
    }, [response.data]);

    const handleTopicClick = (topic: string) => {
        setSelectedTopic(topic);
        void response.refetch();
    };
    return (
        <>
            <Head>
                <title>SyllaBot - Home</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Dashboard>
                    <div className="flex">
                        <div className="w-1/3 border-r border-gray-300 p-4">
                            <h2 className="mb-4">Topics</h2>
                            <ul>
                                {topics.map((topic) => (
                                    <li
                                        key={topic}
                                        onClick={() => handleTopicClick(topic)}
                                        className="cursor-pointer hover:bg-gray-100 p-2 border-b border-gray-200"
                                    >
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-2/3 p-4">
                            {selectedTopic && (
                                <div className="border border-gray-300 p-4">
                                    <h2 className="mb-4">{selectedTopic}</h2>
                                    {response.isLoading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <ReactMarkdown>{question}</ReactMarkdown>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Dashboard>
            </div>
        </>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session: session
        },
    };
};
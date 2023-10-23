import Head from "next/head";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Unit } from "@prisma/client";

export default function Index() {
    const { data: units } = api.course.getAllUnits.useQuery({ courseId: 1 });
    const [unitContent, setUnitContent] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const response = api.chatGPT.getTopicNotes.useQuery(selectedUnit);

    useEffect(() => {
        if (response.data) {
            setUnitContent(response.data);
        }
    }, [response.data]);

    const handleTopicClick = (unit: Unit) => {
        setSelectedUnit(unit);
    };

    return (
        <>
            <Head>
                <title>SyllaBot - Home</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex p-4">
                {/* Topics List on the Left */}
                <div className="w-1/4 bg-white border border-gray-300 shadow-md p-4 rounded-lg">
                    <h2 className="mb-4">Topics</h2>
                    <ul>
                        {units &&
                            units.map((unit) => (
                                <li
                                    key={unit.id}
                                    onClick={() => handleTopicClick(unit)}
                                    className="cursor-pointer hover:bg-gray-100 p-2 border-b border-gray-200"
                                >
                                    {unit.unitName}
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Response Box on the Right */}
                {selectedUnit && (
                    <div className="flex-1 bg-white border border-gray-300 shadow-md p-4 rounded-lg ml-4">
                        {response.isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="prose" dangerouslySetInnerHTML={{ __html: unitContent }} />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session: session,
        },
    };
};

import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Unit } from "@prisma/client";
import Loading from "~/components/Loading";
import { useSession } from "next-auth/react";
import Login from "~/components/Login";

const UnitNotes = (unit: Unit) => {
    const { data, isLoading } = api.chatGPT.getUnitNotes.useQuery(unit);

    if (isLoading) return <Loading />

    if (!data) return <div>No notes returned</div>

    return (
        <div className="w-3/4 ml-4 bg-white border border-gray-300 shadow-md p-4 rounded-lg">
            <h2 className="mb-4">Notes</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data }} />
        </div>
    );
}

const Units = () => {
    const { data, isLoading } = api.course.getAllUnits.useQuery({ courseId: 1 });

    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    if (isLoading) return <Loading />

    if (!data) return <div>No units returned</div>

    const handleTopicClick = (unit: Unit) => {
        setSelectedUnit(unit);
    };

    return (
        <>
            <div className="flex p-4">
                <div className="w-1/4 bg-white border border-gray-300 shadow-md p-4 rounded-lg">
                    <h2 className="mb-4">Topics</h2>
                    <ul>
                        {data.map((unit) => (
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
                {selectedUnit && <UnitNotes {...selectedUnit} />}
            </div>
        </>
    );
}

const Home: NextPage = () => {
    const { data } = useSession();

    if (!data) return <Login />

    return (
        <>
            <Head>
                <title>{"SyllaBot - Home"}</title>
                <meta name="description" content="SyllaBot Ai Assisted Learning" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Units />
        </>
    );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    return {
        props: {
            session: session,
        },
    };
};

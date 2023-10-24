import Head from "next/head";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import Login from "~/components/Login";
import NavBar from "~/components/NavBar";

const Home: NextPage = () => {
    const session = useSession();
    if (!session.data) return <Login />;
    return (
        <>
            <Head>
                <title>{"SyllaBot - Home"}</title>
                <meta name="description" content="SyllaBot Ai Assisted Learning" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <NavBar session={session.data} />
            </div>
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

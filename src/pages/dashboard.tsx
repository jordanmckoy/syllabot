import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout";
import { getServerAuthSession } from "~/server/auth";

const Dashboard = () => {
    const { data: session } = useSession();

    return (
        <Layout session={session}>
            <div>
            </div>
        </Layout>
    )
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    return {
        props: {
            session: session,
        },
    };
};
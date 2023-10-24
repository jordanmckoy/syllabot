import Head from "next/head";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import Login from "~/components/Login";
import NavBar from "~/components/NavBar";

const Chat = () => {
    return (
        <>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img src="/assets/avatar.png" />
                    </div>
                </div>
                <div className="chat-header">
                    ChatGPT
                    <time className="text-xs opacity-50"> 12:45</time>
                </div>
                <div className="chat-bubble">You were the Chosen One!</div>
                <div className="chat-footer opacity-50">
                    Delivered
                </div>
            </div>
            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img src="/assets/avatar.png" />
                    </div>
                </div>
                <div className="chat-header">
                    Student Name
                    <time className="text-xs opacity-50"> 12:46</time>
                </div>
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">
                    Seen at 12:46
                </div>
            </div>
        </>
    )
};
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
            <NavBar session={session.data} />
            <div className="flex items-center justify-center g-5 p-2 min-h-full">
                <div className="card w-2/3 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Unit Title Goes Here</h2>
                        <p>Notes</p>
                        <div className="divider" />
                        <Chat />
                        <div className="card-actions justify-between">
                            <input type="text" placeholder="Ask Me A Question" className="input input-bordered w-3/5" />
                            <button className="btn btn-primary w-1/5">Buy Now</button>
                        </div>
                    </div>
                </div>
                <ul className="menu w-1/3 bg-base-200 rounded-box">
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                    <li><a>Item 3</a></li>
                </ul>
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

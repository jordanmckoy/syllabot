import { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";

const Home: NextPage = () => {
    // const session = useSession();
    // const [socket, setSocket] = useState<Socket | null>(null);

    // if (!session.data) return <Login />;

    // useEffect(() => {
    //     fetch('/api/socket').finally(() => {
    //         const newSocket = io({ withCredentials: true, auth: { sessionId: session.data.user.id } });
    //         setSocket(newSocket);
    //         return () => {
    //             newSocket.disconnect();
    //         };
    //     });
    // }, []);

    // return (
    //     <>
    //         <Head>
    //             <title>{"SyllaBot - Home"}</title>
    //             <meta name="description" content="SyllaBot Ai Assisted Learning" />
    //             <link rel="icon" href="/favicon.ico" />
    //         </Head>
    //         <NavBar session={session.data} />
    //         <div className="flex items-center justify-center g-5 p-2 min-h-full">
    //             <div className="card w-2/3 bg-base-100 shadow-xl">
    //                 <div className="card-body">
    //                     <h2 className="card-title">Unit Title Goes Here</h2>
    //                     <p>Notes</p>
    //                     <div className="divider" />
    //                     {socket && <Chat session={session.data} socket={socket} />}
    //                 </div>
    //             </div>
    //             <ul className="menu w-1/3 bg-base-200 rounded-box">
    //                 <li><a>Item 1</a></li>
    //                 <li><a>Item 2</a></li>
    //                 <li><a>Item 3</a></li>
    //             </ul>
    //         </div>
    //     </>
    // );

    return (
        <>
            <h1>Home</h1>
            <div>
                <button>
                    <Link href="/upload">Upload</Link>
                </button>
                <button>
                    <Link href="/chat">Chat</Link>
                </button>
            </div>
        </>
    )
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

import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter()
  const { data: sessionData } = useSession();

  if (sessionData) {
    return router.push('/')
  }

  return (
    <>
      <Head>
        <title>SyllaBot - Home</title>
        {/* <meta name="description" content="" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome To <span className="text-[hsl(280,100%,70%)]">Sylla</span>Bot
          </h1>
          <div className="flex flex-col items-center gap-2">

            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={
                () => void signIn('auth0', { callbackUrl: '/dashboard' })}
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
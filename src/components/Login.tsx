import { faShieldHalved } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signIn } from "next-auth/react"

const Login = () => {
    return (
        <div className="flex grow flex-col items-center justify-center p-4">
            <div className="relative mb-8 text-6xl font-bold">
                SyllaBot{" "}
                <sup className="absolute top-0 left-full text-xs text-blue-400">
                    [BETA]
                </sup>
            </div>
            <div className="mb-8 text-center text-lg">
                An AI Assisted Learning Platform
            </div>
            <button
                onClick={() => signIn("auth0")}
            >
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faShieldHalved} /> &nbsp; Sign In
                </div>
            </button>
        </div>
    )
}

export default Login
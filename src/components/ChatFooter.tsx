import { Socket } from "socket.io-client";
import { useState } from "react";
import { SocketMessage } from "~/pages/api/socket";
import { Session } from "next-auth";

type ChatFooterProps = {
    socket: Socket | null,
    session: Session
}

const ChatFooter = ({ socket, session }: ChatFooterProps) => {
    const [input, setInput] = useState("");

    const sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (!socket) return;

        const socketMessage: SocketMessage = {
            text: input,
            sender: session.user.id!,
            userName: session.user.name!,
            id: `${socket.id}-${Date.now()}`,
            socketId: socket.id
        };

        socket.emit("message", socketMessage);

        setInput("");
    };

    return (
        <div className="input-group mt-4">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Type your message here"
            />
            <button className="btn btn-primary" onClick={sendMessage}>
                Send
            </button>
        </div>
    )
}

export default ChatFooter;
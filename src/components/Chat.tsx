import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketMessage } from "~/pages/api/socket";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

type ChatProps = {
    socket: Socket
    session: Session
}

const Chat = ({ socket, session }: ChatProps) => {
    const [messages, setMessages] = useState<SocketMessage[]>([])
    const lastMessageRef = useRef(null);

    useEffect(() => {
        socket.on("old-message", data => setMessages([...messages, data]))
    }, [socket, messages])

    useEffect(() => {
        socket.on("new-message", data => setMessages([...messages, data]))
    }, [socket, messages])

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        // @ts-ignore
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {socket && <ChatBody session={session} messages={messages} />}
            {socket && <ChatFooter session={session} socket={socket} />}
        </>
    );
};

export default Chat;
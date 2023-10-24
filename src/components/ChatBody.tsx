
import { Session } from "next-auth";
import { SocketMessage } from "~/pages/api/socket";

type ChatProps = {
    messages: SocketMessage[]
    session: Session
}

const ChatBody = (props: ChatProps) => {
    return (
        <>
            {props.messages.map((message) => (
                <div key={message.id} className={`chat ${message.sender === props.session.user.id ? "chat-end" : "chat-start"}`}>
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img src="/assets/avatar.png" />
                        </div>
                    </div>
                    <div className="chat-header">
                        {message.sender === props.session.user.id ? message.userName : "ChatGPT"}
                        <time className="text-xs opacity-50">
                            {" "}
                            {new Date().toLocaleTimeString()}
                        </time>
                    </div>
                    <div className="chat-content">{message.text}</div>
                    <div className="chat-footer">{message.id}</div>
                </div>
            ))}
        </>
    );
}

export default ChatBody;
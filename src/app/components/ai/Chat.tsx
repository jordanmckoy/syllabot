'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="w-full flex flex-col justify-center" >
      {messages.map(m => (
        <div key={m.id} className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="chat-bubble">{m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}</div>
        </div>
      ))}

      <form className="mt-5 self-center" onSubmit={handleSubmit}>
        <div className='join'>
          <input
            className="input input-bordered join-item"
            placeholder="Ask me a question"
            value={input}
            onChange={handleInputChange} />
          <button type="submit" className="btn join-item rounded-r-full">Send</button>
        </div>
      </form>
    </div>
  );
}
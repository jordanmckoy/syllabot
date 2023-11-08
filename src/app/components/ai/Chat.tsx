'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="w-full flex flex-col justify-center" >
      {messages.map(m => (
        <div key={m.id} className={`chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              {m.role === 'user' ?
                <img src="https://media.discordapp.net/attachments/781557164984238080/781581518824538143/84c4b572d88635ee5310d037bbb6a435.png?ex=65565a03&is=6543e503&hm=b29da75345d0f8be6c476ee010eb2b4e27e914128e3759fc06d26b4f5c0fbb9f&=&width=1130&height=1130" />
                :
                <img width="48" height="48" src="https://img.icons8.com/color-glass/48/bot.png" alt="bot" />
              }
            </div>
          </div>
          <div className="chat-bubble">{m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}</div>
        </div>
      ))}

      <div className='mt-5 self-center'>
        <form onSubmit={handleSubmit}>
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
    </div>
  );
}
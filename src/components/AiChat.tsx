import { useEffect, useRef, useState } from 'react';
import { api } from '~/utils/api';

type Props = {
    unitId: string;
    userId: string;
};

const AiChat = ({ unitId, userId }: Props) => {
    const messageInput = useRef<HTMLTextAreaElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<[string, string][]>([]);
    const [newMessage, setNewMessage] = useState('');

    const { mutate } = api.chat.setHistory.useMutation();
    const { mutate: clearMutation } = api.chat.clearHistory.useMutation();

    const handleReset = () => {
        setHistory([]);
        clearMutation({ unitId, userId });
    };

    useEffect(() => {
        // Function to handle incoming data from the server
        const handleData = async (message: string) => {
            const response = await fetch('/api/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    question: message,
                    unitId: unitId,
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = response.body;

            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);

                setHistory((prevHistory) => {
                    prevHistory[prevHistory.length - 1]![1] += chunkValue;
                    return prevHistory;
                });
            }

            setIsLoading(false);
        };

        if (newMessage) {
            setHistory((prevHistory) => [...prevHistory, [newMessage, '']]);
            handleData(newMessage);
        }
    }, [newMessage, unitId, userId]);

    const handleEnter = async (
        e: React.KeyboardEvent<HTMLTextAreaElement> &
            React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            const message = messageInput.current?.value;
            messageInput.current!.value = '';

            if (!message || message === '') {
                return;
            }

            setNewMessage(message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl'>
                {history.map((items) => (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className={`bg-blue-500 p-3 rounded-lg text-white ${index % 2 === 0 ? 'self-end' : 'self-start'
                                }`}
                        >
                            {item}
                        </div>
                    ))
                ))}
            </div>
            <form onSubmit={handleEnter} className=' w-full bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] flex mt-5'>
                <div className='join min-w-full'>
                    <textarea
                        name='Message'
                        placeholder='Type your query'
                        ref={messageInput}
                        className='textarea flex-1 resize-none bg-transparent outline-none pt-4 pl-4 join-item'
                    />
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='btn join-item rounded-r-md min-h-full'
                    >
                        Send
                    </button>
                </div>
            </form>
            <button
                onClick={handleReset}
                type='reset'
                className='p-4 rounded-md bg-white text-gray-500 dark:hover-text-gray-400 dark:hover-bg-gray-900 disabled:hover-bg-transparent dark:disabled:hover-bg-transparent mt-4'
            >
                Clear History
            </button>
        </div>
    );
};

export default AiChat;

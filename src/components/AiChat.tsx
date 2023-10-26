import { useEffect, useRef, useState } from 'react';

const AiChat = () => {
    const messageInput = useRef<HTMLTextAreaElement | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleEnter = (
        e: React.KeyboardEvent<HTMLTextAreaElement> &
            React.FormEvent<HTMLFormElement>
    ) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            setIsLoading(true);
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = messageInput.current?.value;
        if (message !== undefined) {
            setHistory((prev) => [...prev, message]);
            messageInput.current!.value = '';
        }

        if (!message) {
            return;
        }

        const response = await fetch('/api/response', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: message,
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

        setHistory((prev) => [...prev, message]);

        let currentResponse: string[] = [];
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            currentResponse = [...currentResponse, chunkValue];
            setHistory((prev) => [...prev.slice(0, -1), currentResponse.join('')]);
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        localStorage.removeItem('response');
        setHistory([]);
    };

    useEffect(() => {
        localStorage.setItem('response', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        const storedResponse = localStorage.getItem('response');
        if (storedResponse) {
            setHistory(JSON.parse(storedResponse));
        }
    }, []);

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl'>
                {isLoading
                    ? history.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`bg-blue-500 p-3 rounded-lg text-white`}
                        >
                            <p>{item}</p>
                        </div>
                    ))
                    : history
                        ? history.map((item: string, index: number) => (
                            <div
                                key={index}
                                className={`bg-blue-500 p-3 rounded-lg text-white`}
                            >
                                <p>{item}</p>
                            </div>
                        ))
                        : null}
            </div>
            <form onSubmit={handleSubmit} className='w-full bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] flex mt-5'>
                <textarea
                    name='Message'
                    placeholder='Type your query'
                    ref={messageInput}
                    onKeyDown={handleEnter}
                    className='flex-1 resize-none bg-transparent outline-none pt-4 pl-4'
                />
                <button
                    disabled={isLoading}
                    type='submit'
                    className='p-1 text-gray-800 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent'
                >
                    <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth='0'
                        viewBox='0 0 20 20'
                        className='h-4 w-4 rotate-90'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                    </svg>
                </button>
            </form>
            <button
                onClick={handleReset}
                type='reset'
                className='p-4 rounded-md bg-white text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent mt-4'
            >
                Clear History
            </button>
        </div>
    );
};

export default AiChat;
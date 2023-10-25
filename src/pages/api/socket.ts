import { Server } from 'socket.io';
import { db } from '../../server/db';
import { getChatGPTResponse } from '~/server/helpers/chatGPT';

export type SocketMessage = {
    id: string;
    sender: string;
    userName: string;
    text: string;
    socketId: string;
}
// @ts-ignore
const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);

        io.on('connection', async (socket) => {

            const userId = socket.handshake.auth.sessionId;

            const session = await db.user.findFirst({
                where: { id: userId },
            });

            if (!session) {
                socket.emit('Unauthorized', 'Session is not active or expired');
                socket.disconnect(true);
            }

            socket.on('message', (data: SocketMessage) => {
                socket.emit('old-message', data);
                getChatGPTResponse({ prompt: data.text, userId: userId, unitId: 1 }, socket)
            });

            socket.on('disconnect', () => {
                console.log('a user disconnected');
            });
        });

        res.socket.server.io = io;
    } else {
        console.log('Using existing io');
    }
    res.end();
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler;





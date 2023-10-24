import { Server } from 'socket.io';
import { db } from '../../server/db';
import { env } from '~/env.mjs';

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
                data.text = 'Hello from server'
                data.sender = 'server'
                socket.emit('new-message', data);
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





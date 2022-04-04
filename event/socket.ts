import { Server } from 'socket.io';

export function attachEvents(io: Server) {

    io.on('connection', (_) => {
        console.log('a socket connected');
    });
}

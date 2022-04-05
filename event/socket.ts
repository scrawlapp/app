import { Server } from 'socket.io';

interface PageUpdate {

    pageId: string,
    blockId: string,
    newValue: string
}

export function attachEvents(io: Server) {

    io.on('connection', (socket) => {
        socket.on('page diff', (diff: PageUpdate) => {
            io.emit('page diff', diff);
        });
    })
}

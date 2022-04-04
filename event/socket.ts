import { Server } from 'socket.io';

interface PageDiff {

    pageId: string,
    blockId: string,
    diff: string
}

export function attachEvents(io: Server) {

    io.on('connection', (socket) => {
        socket.on('page diff', (diff: PageDiff) => {
            io.emit('page diff', diff);
        });
    })
}

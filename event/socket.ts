import { Server } from 'socket.io';

// Describe how a page update message looks like
interface PageUpdate {

    pageId: string,
    blockId: string,
    newValue: string
}

// This will attach events to the server side instance
// of socket.io
export function attachEvents(io: Server) {

    io.on('connection', (socket) => {
        socket.on('page diff', (diff: PageUpdate) => {
            // Emit this page diff to all other clients.
            // This is not ideal. A list of authorised clients
            // should be maintained in the future. 
            io.emit('page diff', diff);
        });
    })
}

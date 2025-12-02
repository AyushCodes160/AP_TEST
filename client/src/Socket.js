import {io} from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 20000,
        transports: ['websocket', 'polling'],
    };
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
    console.log('Initializing socket connection to:', backendUrl);
    
    const socket = io(backendUrl, options);
    
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
        }, 15000);
        
        socket.on('connect', () => {
            console.log('Socket.IO connected successfully');
            clearTimeout(timeout);
            resolve(socket);
        });
        
        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            clearTimeout(timeout);
            reject(error);
        });
        
        if (socket.connected) {
            console.log('Socket already connected');
            clearTimeout(timeout);
            resolve(socket);
        }
    });
}
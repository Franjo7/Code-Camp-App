import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_URL_USER_SOCKET,{
    autoConnect: false,
}); 

export default socket;

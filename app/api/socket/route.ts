import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface NextResponseWithSocket {
  socket: NetSocket & {
    server: SocketServer;
  };
  end: () => void;
}

const ioHandler = (req: NextRequest, res: NextResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...');

    const io = new SocketIOServer(res.socket.server as SocketServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Store active rooms and users
    const rooms = new Map<string, Set<string>>();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join a room
      socket.on('join-room', (roomId: string, userId: string) => {
        socket.join(roomId);

        // Track room membership
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId)?.add(userId);

        // Get other users in the room
        const otherUsers = Array.from(rooms.get(roomId) || []).filter((id) => id !== userId);

        // Notify existing users about new user
        socket.to(roomId).emit('user-joined', userId);

        // Send list of existing users to the new user
        socket.emit('existing-users', otherUsers);

        console.log(`User ${userId} joined room ${roomId}`);
      });

      // WebRTC signaling
      socket.on('offer', (data: { to: string; offer: RTCSessionDescriptionInit; from: string }) => {
        socket.to(data.to).emit('offer', {
          offer: data.offer,
          from: data.from,
        });
      });

      socket.on('answer', (data: { to: string; answer: RTCSessionDescriptionInit; from: string }) => {
        socket.to(data.to).emit('answer', {
          answer: data.answer,
          from: data.from,
        });
      });

      socket.on('ice-candidate', (data: { to: string; candidate: RTCIceCandidateInit; from: string }) => {
        socket.to(data.to).emit('ice-candidate', {
          candidate: data.candidate,
          from: data.from,
        });
      });

      // Leave room
      socket.on('leave-room', (roomId: string, userId: string) => {
        socket.leave(roomId);
        rooms.get(roomId)?.delete(userId);
        socket.to(roomId).emit('user-left', userId);
        console.log(`User ${userId} left room ${roomId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Clean up rooms
        rooms.forEach((users, roomId) => {
          users.forEach((userId) => {
            if (socket.id === userId) {
              users.delete(userId);
              socket.to(roomId).emit('user-left', userId);
            }
          });
        });
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already running');
  }

  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler;

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Room } from 'trystero';
import { createTrysteroRoom } from '../lib/trystero-config';
import type { Participant } from '../lib/types';

export const useTrysteroRoom = (roomId: string, localStream: MediaStream | null) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [myPeerId, setMyPeerId] = useState<string>('');

  const roomRef = useRef<Room | null>(null);
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());

  useEffect(() => {
    if (!localStream) {
      console.log('Waiting for local stream...');
      return;
    }

    let mounted = true;
    setConnectionStatus('connecting');

    const initRoom = async () => {
      try {
        // Создаем или присоединяемся к комнате
        const room = createTrysteroRoom(roomId);
        roomRef.current = room;

        // Получаем свой ID из Trystero
        // selfId нужно импортировать динамически
        const { selfId } = await import('trystero');

        if (!mounted) return;

        setMyPeerId(selfId);
        console.log('Connected to Trystero room with ID:', selfId);

        // Отправляем свой видеопоток всем в комнате
        room.addStream(localStream);
        console.log('Local stream added to room');

        // Слушаем новых участников
        room.onPeerJoin((peerId: string) => {
          console.log('Peer joined:', peerId);
          // Отправляем поток новому участнику
          room.addStream(localStream, peerId);
        });

        // Слушаем видеопотоки от других участников
        room.onPeerStream((stream: MediaStream, peerId: string) => {
          console.log('Received stream from:', peerId);

          if (!mounted) return;

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.set(peerId, {
              id: peerId,
              stream: stream,
              isAudioEnabled: true,
              isVideoEnabled: true,
            });
            return newMap;
          });

          streamsRef.current.set(peerId, stream);
        });

        // Слушаем уход участников
        room.onPeerLeave((peerId: string) => {
          console.log('Peer left:', peerId);

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.delete(peerId);
            return newMap;
          });

          streamsRef.current.delete(peerId);
        });

        setConnectionStatus('connected');
        console.log('Trystero room initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Trystero room:', error);
        setConnectionStatus('disconnected');
      }
    };

    initRoom();

    // Cleanup при размонтировании
    return () => {
      mounted = false;
      if (roomRef.current) {
        console.log('Leaving room...');
        roomRef.current.leave();
      }
    };
  }, [roomId, localStream]);

  const leaveRoom = useCallback(() => {
    console.log('Leaving room...');
    if (roomRef.current) {
      roomRef.current.leave();
    }
    setParticipants(new Map());
    setConnectionStatus('disconnected');
  }, []);

  // В Trystero первый вошедший автоматически становится создателем
  // но это не так важно, как в PeerJS
  const isCreator = participants.size === 0 && connectionStatus === 'connected';

  return {
    myPeerId,
    participants,
    isCreator,
    connectionStatus,
    leaveRoom,
    endConference: leaveRoom, // для совместимости
  };
};

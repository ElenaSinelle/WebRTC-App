'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Room } from 'trystero';
import { createTrysteroRoom } from '../lib/trystero-config';
import type { Participant } from '../lib/types';
import { useMobileDetect } from './useMobileDetect';

export const useTrysteroRoom = (roomId: string, localStream: MediaStream | null) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [myPeerId, setMyPeerId] = useState<string>('');

  const roomRef = useRef<Room | null>(null);
  const streamsRef = useRef<Map<string, MediaStream>>(new Map());
  const { isAndroid, isIOS } = useMobileDetect();

  useEffect(() => {
    if (!localStream) {
      return;
    }

    let mounted = true;
    setConnectionStatus('connecting');

    const initRoom = async () => {
      try {
        // create room and connect to it
        const room = createTrysteroRoom(roomId);
        roomRef.current = room;

        // get id from trystero
        const { selfId } = await import('trystero');

        if (!mounted) return;

        setMyPeerId(selfId);

        if (isAndroid) {
          // Timeout for initialization on Android
          setTimeout(() => {
            if (roomRef.current && localStream) {
              roomRef.current.addStream(localStream);
            }
          }, 300);
        } else if (isIOS) {
          console.log('iOS detected, applying special handling');

          // enable audio-tracks
          localStream.getAudioTracks().forEach((track) => {
            track.enabled = true;
          });

          // settimeout for adding video for iOS
          setTimeout(() => {
            if (roomRef.current && localStream) {
              roomRef.current.addStream(localStream);

              //  invoke audio session for iOS
              const audioContext = new (
                window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
              )();
              if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                  console.log('🍎 AudioContext resumed for iOS');
                });
              }
            }
          }, 100);
        } else {
          // Desktop: сразу добавляем стрим
          room.addStream(localStream);
        }

        // send stream to all participants
        // room.addStream(localStream);

        // listen to new participants
        room.onPeerJoin((peerId: string) => {
          console.log('Peer joined:', peerId);

          // send stream to a new participant
          if (isIOS) {
            // settimeout for sending to iOS
            setTimeout(() => {
              if (roomRef.current && localStream) {
                roomRef.current.addStream(localStream, peerId);
              }
            }, 200);
          } else {
            room.addStream(localStream, peerId);
          }
        });

        // listen video-streams from other participants
        room.onPeerStream((stream: MediaStream, peerId: string) => {
          // console.log('Received stream from:', peerId);

          if (!mounted) return;

          // activate audio for iOS
          if (isIOS) {
            stream.getAudioTracks().forEach((track) => {
              track.enabled = true;
            });
          }

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

        // listen participants leave
        room.onPeerLeave((peerId: string) => {
          // console.log('Peer left:', peerId);

          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.delete(peerId);
            return newMap;
          });

          streamsRef.current.delete(peerId);
        });

        setConnectionStatus('connected');
        // console.log('Trystero room initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Trystero room:', error);
        setConnectionStatus('disconnected');
      }
    };

    initRoom();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (roomRef.current) {
        roomRef.current.leave();
      }
    };
  }, [roomId, localStream]);

  const leaveRoom = useCallback(() => {
    // console.log('Leaving room...');
    if (roomRef.current) {
      roomRef.current.leave();
    }
    setParticipants(new Map());
    setConnectionStatus('disconnected');
  }, []);

  // first participant becomes creator
  const isCreator = participants.size === 0 && connectionStatus === 'connected';

  return {
    myPeerId,
    participants,
    isCreator,
    connectionStatus,
    leaveRoom,
    endConference: leaveRoom,
  };
};

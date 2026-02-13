import { joinRoom } from 'trystero/nostr';

export const APP_ID = 'webrtc-app-es';

export const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://nostr.wine',
  'wss://relay.nostr.info',
  'wss://relay.current.fyi',
  'wss://brb.io',
  'wss://nostr.bitcoiner.social',
];

export const roomConfig = {
  appId: APP_ID,
  relays: RELAYS,
};

export const createTrysteroRoom = (roomId: string) => {
  return joinRoom(roomConfig, roomId);
};

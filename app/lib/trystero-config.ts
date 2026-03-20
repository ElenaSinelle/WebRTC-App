import { joinRoom } from 'trystero/nostr';

export const APP_ID = 'webrtc-app-es';

export const RELAYS = [
  'wss://prl.plus/',
  'wss://adre.su/',
  'wss://176.108.254.19/relay',
  'wss://relay.edino.net/',
  'wss://nostr.jerrynya.fun/',
  'wss://ai.techunder.tech:56711/',
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://nostr.wine',
  'wss://relay.nostr.info',
  'wss://relay.current.fyi',
  'wss://brb.io',
  'wss://nostr.bitcoiner.social',
  'wss://relay.primal.net',
  'wss://nostr.mom',
  'wss://relay.nostr.band',
];

export const TURN_CONFIG = [
  {
    urls: [
      'turn:openrelayproject.metered.ca:80?transport=tcp',
      'turn:openrelayproject.metered.ca:443?transport=tcp',
      'turn:openrelayproject.website:80?transport=tcp',
      'turn:openrelayproject.website:443?transport=tcp',
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

export const roomConfig = {
  appId: APP_ID,
  relays: RELAYS,
  turnConfig: TURN_CONFIG,
};

export const createTrysteroRoom = (roomId: string) => {
  return joinRoom(roomConfig, roomId);
};

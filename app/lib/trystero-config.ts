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
      'turn:standard.relay.metered.ca:80',
      'turn:standard.relay.metered.ca:80?transport=tcp',
      'turn:standard.relay.metered.ca:443',
      'turns:standard.relay.metered.ca:443?transport=tcp',
    ],
    username: 'd9bdd5e9d58e83af8d8da959',
    credential: '4+6G4gxznBUMNuJV',
  },
  {
    urls: [
      'turn:global.relay.metered.ca:80',
      'turn:global.relay.metered.ca:80?transport=tcp',
      'turn:global.relay.metered.ca:443',
      'turns:global.relay.metered.ca:443?transport=tcp',
    ],
    username: 'a134a600328159374d42be56',
    credential: 'fIn2Nb1Syox77e/F',
  },
];

export const roomConfig = {
  appId: APP_ID,
  relays: RELAYS,
  rtcConfig: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
  },
  //   iceCandidatePoolSize: 10,
  // },
  // peerConfig: {
  //   iceConnectionStateChangeTimeout: 30000,
  //   gatherTimeout: 20000,
  //   iceTransportPolicy: 'all',
  // },
};

export const createTrysteroRoom = (roomId: string) => {
  return joinRoom(roomConfig, roomId);
};

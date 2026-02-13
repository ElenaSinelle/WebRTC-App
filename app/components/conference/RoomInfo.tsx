'use client';

interface RoomInfoProps {
  roomId: string;
  isCreator: boolean;
  participantsCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  onCopyRoomId: () => void;
  copied: boolean;
}

export const RoomInfo = ({
  roomId,
  isCreator,
  participantsCount,
  connectionStatus,
  onCopyRoomId,
  copied,
}: RoomInfoProps) => {
  const statusColors = {
    connecting: 'text-yellow-600',
    connected: 'text-green-600',
    disconnected: 'text-red-600',
  };

  const statusText = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
  };

  const totalParticipants = participantsCount + 1;

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">
          Room: <span className="font-mono">{roomId}</span>
        </h2>
        <button
          onClick={onCopyRoomId}
          className="text-sm bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-lg transition"
        >
          {copied ? 'Copied!' : 'Copy Room ID'}
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className={statusColors[connectionStatus]}>{statusText[connectionStatus]}</span>
        <span className="text-gray-600">Participants: {totalParticipants}</span>
      </div>

      {isCreator && (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
          You are the host
        </span>
      )}

      {!isCreator && connectionStatus === 'connected' && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          You joined as participant
        </span>
      )}

      {participantsCount === 0 && connectionStatus === 'connected' && isCreator && (
        <div className="flex flex-col gap-2 items-center mt-4">
          <p className="text-gray-600">Waiting for participants...</p>
          <p className="text-sm text-gray-500">Share this Room ID with others</p>
        </div>
      )}
    </div>
  );
};

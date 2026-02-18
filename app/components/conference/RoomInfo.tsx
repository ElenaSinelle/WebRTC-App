'use client';

interface RoomInfoProps {
  participantsCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export const RoomInfo = ({ participantsCount, connectionStatus }: RoomInfoProps) => {
  const statusConfig = {
    connecting: {
      bg: 'bg-status-warning',
      text: 'text-status-warning',
      label: 'Connecting...',
    },
    connected: {
      bg: 'bg-status-success',
      text: 'text-status-success',
      label: 'Connected',
    },
    disconnected: {
      bg: 'bg-status-danger',
      text: 'text-status-danger',
      label: 'Disconnected',
    },
  };

  const config = statusConfig[connectionStatus];

  const totalParticipants = participantsCount + 1;

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className={`relative flex h-2.5 w-2.5`}>
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${config.bg} ${
                connectionStatus === 'connecting' ? 'animate-pulse' : ''
              }`}
            ></span>
          </span>
          <span className={`${config.text} font-medium`}>{config.label}</span>
        </div>

        <span className="text-text-secondary">
          Participants: <span className="font-semibold text-text-primary">{totalParticipants}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {connectionStatus === 'connected' && (
          <span className="bg-background-input text-text-primary px-4 py-1.5 rounded-full text-xs font-medium border border-border-secondary shadow-sm">
            You joined room
          </span>
        )}
      </div>

      {participantsCount === 0 && connectionStatus === 'connected' && (
        <div className="mt-2 text-center">
          <p className="text-text-secondary text-sm flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Waiting for participants to join...
          </p>
        </div>
      )}
    </div>
  );
};

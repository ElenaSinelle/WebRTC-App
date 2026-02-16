'use client';

import { Button } from '../ui/Button';

interface ConferenceControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isCreator: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onCopyLink: () => void;
  onLeave: () => void;
  onEndConference: () => void;
  copiedLink: boolean;
  onCopyRoomId: () => void;
  copiedId: boolean;
}

export const ConferenceControls = ({
  isMuted,
  isVideoOff,
  isCreator,
  onToggleMute,
  onToggleVideo,
  onCopyLink,
  onLeave,
  onEndConference,
  copiedLink,
  onCopyRoomId,
  copiedId,
}: ConferenceControlsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onToggleMute} variant={isMuted ? 'danger' : 'primary'}>
          {isMuted ? 'Enable microphone' : 'Disable microphone'}
        </Button>

        <Button onClick={onToggleVideo} variant={isVideoOff ? 'danger' : 'primary'}>
          {isVideoOff ? 'Enable camera' : 'Disable camera'}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onCopyLink} variant="secondary">
          {copiedLink ? 'Link copied!' : 'Copy room link'}
        </Button>

        <Button onClick={onCopyRoomId} variant="secondary">
          {copiedId ? 'Room Id copied!' : 'Copy room ID'}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onLeave} variant="secondary">
          Leave room
        </Button>

        {isCreator && (
          <Button onClick={onEndConference} variant="danger">
            End conference
          </Button>
        )}
      </div>
    </div>
  );
};

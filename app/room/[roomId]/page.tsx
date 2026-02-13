'use client';

import { useParams } from 'next/navigation';
import { useMediaStream } from '@/app/hooks/useMediaStream';
import { useTrysteroRoom } from '@/app/hooks/useTrysteroRoom'; // ← изменен импорт
import { useRoom } from '@/app/hooks/useRoom';
import { ParticipantsGrid } from '@/app/components/conference/ParticipantsGrid';
import { ConferenceControls } from '@/app/components/conference/ConferenceControls';
import { RoomInfo } from '@/app/components/conference/RoomInfo';
import { Button } from '@/app/components/ui/Button';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;

  const { stream: localStream, isMuted, isVideoOff, toggleMute, toggleVideo, error: mediaError } = useMediaStream();

  // Заменяем usePeerConnection на useTrysteroRoom
  const {
    participants,
    isCreator,
    connectionStatus,
    endConference,
    leaveRoom: leavePeerRoom,
  } = useTrysteroRoom(roomId, localStream);

  const {
    copied,
    copyRoomLink,
    copyRoomId,
    leaveRoom: navigateLeave,
    showEndConfirmation,
    openEndConfirmation,
    closeEndConfirmation,
  } = useRoom(roomId);

  const handleLeave = () => {
    leavePeerRoom();
    navigateLeave();
  };

  const handleEndConference = () => {
    endConference();
    closeEndConfirmation();
    navigateLeave();
  };

  if (mediaError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Camera/microphone access error</p>
          <p>{mediaError}</p>
          <Button variant="primary" onClick={() => window.location.reload()} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 flex flex-col gap-6">
      <RoomInfo
        roomId={roomId}
        isCreator={isCreator}
        participantsCount={participants.size}
        connectionStatus={connectionStatus}
        onCopyRoomId={copyRoomId}
        copied={copied === 'id'}
      />

      <ParticipantsGrid
        localStream={localStream}
        participants={participants}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
      />

      <ConferenceControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isCreator={isCreator}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onCopyLink={copyRoomLink}
        onLeave={handleLeave}
        onEndConference={openEndConfirmation}
        copied={copied === 'link'}
      />

      {showEndConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">End conference?</h3>
            <p className="text-gray-600 mb-6">All participants will be disconnected. This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeEndConfirmation}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleEndConference}>
                End
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

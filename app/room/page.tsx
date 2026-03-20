import { Suspense } from 'react';
import RoomContent from '../components/room/RoomContent';

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto p-6 text-center">
          <div className="bg-background-card rounded-md shadow-lg border border-border-secondary p-8">
            <p className="text-text-secondary">Loading Room...</p>
          </div>
        </div>
      }
    >
      <RoomContent />
    </Suspense>
  );
}

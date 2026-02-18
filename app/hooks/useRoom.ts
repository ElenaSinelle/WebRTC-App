'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useRoom = (roomId: string) => {
  const router = useRouter();
  const [copied, setCopied] = useState<'none' | 'link' | 'id'>('none');
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  const copyRoomLink = useCallback(async () => {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied('link');
      setTimeout(() => setCopied('none'), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, []);

  const copyRoomId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied('id');
      setTimeout(() => setCopied('none'), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  }, [roomId]);

  const navigateLeave = useCallback(() => {
    router.push('/');
  }, [router]);

  const openEndConfirmation = useCallback(() => {
    setShowEndConfirmation(true);
  }, []);

  const closeEndConfirmation = useCallback(() => {
    setShowEndConfirmation(false);
  }, []);

  return {
    copied,
    copyRoomLink,
    copyRoomId,
    navigateLeave,
    showEndConfirmation,
    openEndConfirmation,
    closeEndConfirmation,
  };
};

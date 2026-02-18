'use client';

import { useEffect, useState } from 'react';
import { TgHintLoader } from './telegramClient';

interface TelegramHintDetectorProps {
  onDetectionComplete: () => void;
}

export const TelegramHintDetector = ({ onDetectionComplete }: TelegramHintDetectorProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <TgHintLoader onComplete={onDetectionComplete} />;
};

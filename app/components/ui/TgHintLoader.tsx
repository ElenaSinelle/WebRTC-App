'use client';

import Script from 'next/script';

export const TgHintLoader = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <Script
      src="https://cdn.jsdelivr.net/gh/dontbug/tg-hint/dist/tg-hint.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (isDev) console.log(' tg-hint loaded');
      }}
      onError={(error) => {
        console.error(' Failed to load tg-hint:', error);
      }}
    />
  );
};

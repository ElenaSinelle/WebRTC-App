'use client';

import { useMemo } from 'react';

export const useMobileDetect = () => {
  const deviceInfo = useMemo(() => {
    const isDev = process.env.NODE_ENV === 'development';
    if (typeof window === 'undefined') {
      return { isMobile: false, isIOS: false, isAndroid: false, browser: '' };
    }

    const userAgent = navigator.userAgent;
    const isMobile =
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent,
      );
    const isIOS = /iP(hone|od|ad)/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    let browser = '';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'safari';
    else if (userAgent.includes('Edg')) browser = 'edge';
    else if (userAgent.includes('Miui')) browser = 'miui';

    if (isIOS) {
      const match = userAgent.match(/OS (\d+)_(\d+)/);
      const version = match ? `${match[1]}.${match[2]}` : 'unknown';
      if (isDev) console.log('iOS version:', version);
    }

    return { isMobile, isIOS, isAndroid, browser };
  }, []);

  return deviceInfo;
};

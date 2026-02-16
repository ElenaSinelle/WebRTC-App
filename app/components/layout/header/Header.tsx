'use client';

import { DebugConsole } from '../../debugConsole';

export default function Header() {
  return (
    <>
      <DebugConsole />
      <header className="w-full pt-4 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">WebRTC Video-conference</h1>
      </header>
    </>
  );
}

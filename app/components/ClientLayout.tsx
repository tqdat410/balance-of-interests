"use client";

import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* AudioManager removed - now handled by GameControlButtons per-screen */}
      {children}
    </>
  );
}

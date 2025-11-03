"use client";

import React from "react";
import AudioManager from "./AudioManager";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AudioManager />
      {children}
    </>
  );
}

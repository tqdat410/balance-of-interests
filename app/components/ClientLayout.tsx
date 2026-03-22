"use client";

import React from "react";
import * as ReactDOM from "react-dom";

const LOADING_SPINNER_SRC = "/background/db_loading.svg";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  ReactDOM.preload(LOADING_SPINNER_SRC, {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <>
      {/* AudioManager removed - now handled by GameControlButtons per-screen */}
      {children}
    </>
  );
}

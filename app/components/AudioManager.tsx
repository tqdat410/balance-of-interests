"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AudioManager() {
  const [bgVolume, setBgVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize background music
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/sound/01HSH4ZF979N7WBMDSDCHJ8D0X.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = bgVolume;

      // Try to play music
      const playMusic = () => {
        if (bgMusicRef.current) {
          bgMusicRef.current
            .play()
            .then(() => {
              setIsMusicPlaying(true);
            })
            .catch(() => {
              setIsMusicPlaying(false);
            });
        }
      };

      // Try to play on load
      playMusic();

      // Also try to play on first user interaction
      const startMusic = () => {
        playMusic();
        document.removeEventListener("click", startMusic);
      };
      document.addEventListener("click", startMusic, { once: true });

      // Initialize click sound
      clickSoundRef.current = new Audio(
        "/sound/01HY1ACCZV6A2ZNTEV25X7KJGM.mp3"
      );
      clickSoundRef.current.volume = sfxVolume;

      // Add click event listener for sound effect
      const handleClick = () => {
        if (clickSoundRef.current && sfxVolume > 0) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch(() => {});
        }
      };

      document.addEventListener("click", handleClick);

      // Listen for scene/screen change events to restart music (always enabled)
      const handleSceneChange = () => {
        if (bgMusicRef.current && isMusicPlaying) {
          bgMusicRef.current.currentTime = 0;
        }
      };

      // Listen to various game state changes
      window.addEventListener("gameStateChange", handleSceneChange);
      window.addEventListener("popstate", handleSceneChange); // For page navigation

      return () => {
        document.removeEventListener("click", handleClick);
        window.removeEventListener("gameStateChange", handleSceneChange);
        window.removeEventListener("popstate", handleSceneChange);
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
        }
      };
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = bgVolume;
      if (bgVolume === 0) {
        bgMusicRef.current.pause();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync music state with volume
        setIsMusicPlaying(false);
      } else if (!isMusicPlaying) {
        bgMusicRef.current
          .play()
          // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync music state with play
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isMusicPlaying intentionally excluded to prevent infinite loop
  }, [bgVolume]);

  useEffect(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = sfxVolume;
    }
  }, [sfxVolume]);

  // Close controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showControls) {
        const target = event.target as Element;
        // Check if click is outside audio controls
        if (
          !target.closest(".audio-controls-panel") &&
          !target.closest(".audio-controls-button")
        ) {
          setShowControls(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showControls]);

  return (
    <div className="fixed top-5 right-5 z-60">
      {/* Sound Control Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="audio-controls-button w-12 h-12 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center text-2xl"
        title="Âm thanh"
      >
        {isMusicPlaying ? "𝆕" : "𝆔"}
      </button>

      {/* Volume Controls Panel */}
      {showControls && (
        <div className="audio-controls-panel absolute top-14 right-0 bg-white rounded-lg shadow-xl border-2 border-amber-400 p-4 w-64 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <span className="text-amber-700 text-lg">Âm thanh</span>
            <button
              onClick={() => setShowControls(false)}
              className="text-slate-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Background Music Volume */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-700">Nhạc nền</label>
              <span className="text-xs text-slate-500">
                {Math.round(bgVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={bgVolume}
              onChange={(e) => setBgVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Click Sound Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-700">Hiệu ứng</label>
              <span className="text-xs text-slate-500">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

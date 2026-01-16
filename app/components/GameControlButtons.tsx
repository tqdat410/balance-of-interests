"use client";

import React, { useState, useEffect, useRef } from "react";
import FAQPopup from "./FAQPopup";
import SettingsPopup from "./SettingsPopup";

interface GameControlButtonsProps {
  showOnMenu?: boolean;
}

// Subtle button style - neutral, blends with theme
const subtleButtonStyle = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.7)"
};

export default function GameControlButtons({ showOnMenu = false }: GameControlButtonsProps) {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Audio state - managed here for game screen
  const [bgVolume, setBgVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bgVolume");
      return saved !== null ? parseFloat(saved) : 0.3;
    }
    return 0.3;
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sfxVolume");
      return saved !== null ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio (only if NOT on menu)
  useEffect(() => {
    if (showOnMenu) return; // Don't initialize audio on menu
    
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/sound/01HSH4ZF979N7WBMDSDCHJ8D0X.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = bgVolume;

      const playMusic = () => {
        if (bgMusicRef.current) {
          bgMusicRef.current
            .play()
            .then(() => setIsMusicPlaying(true))
            .catch(() => setIsMusicPlaying(false));
        }
      };

      playMusic();

      const startMusic = () => {
        playMusic();
        document.removeEventListener("click", startMusic);
      };
      document.addEventListener("click", startMusic, { once: true });

      clickSoundRef.current = new Audio("/sound/01HY1ACCZV6A2ZNTEV25X7KJGM.mp3");
      clickSoundRef.current.volume = sfxVolume;

      const handleClick = () => {
        if (clickSoundRef.current && sfxVolume > 0) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch(() => {});
        }
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
        }
      };
    }
  }, [showOnMenu]);

  // Update volume
  useEffect(() => {
    if (showOnMenu) return;
    
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = bgVolume;
      if (bgVolume === 0) {
        bgMusicRef.current.pause();
        setIsMusicPlaying(false);
      } else if (!isMusicPlaying) {
        bgMusicRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
    }
  }, [bgVolume, showOnMenu]);

  useEffect(() => {
    if (showOnMenu) return;
    
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = sfxVolume;
    }
  }, [sfxVolume, showOnMenu]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("bgVolume", bgVolume.toString());
  }, [bgVolume]);

  useEffect(() => {
    localStorage.setItem("sfxVolume", sfxVolume.toString());
  }, [sfxVolume]);

  // On menu, don't show settings button (no audio)
  if (showOnMenu) {
    return (
      <>
        {/* Fixed bottom-left position */}
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2">
          {/* Help Button */}
          <button
            onClick={() => setShowFAQ(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-bold text-lg transition-all duration-200 hover:bg-white/80 hover:text-slate-700 active:scale-95"
            style={subtleButtonStyle}
            title="Hướng dẫn"
          >
            <img src="/background/faq.svg" alt="Hướng dẫn" className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Popup */}
        {showFAQ && <FAQPopup onClose={() => setShowFAQ(false)} />}
      </>
    );
  }

  return (
    <>
      {/* Fixed bottom-left position */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2">
        {/* Help Button */}
        <button
          onClick={() => setShowFAQ(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-bold text-lg transition-all duration-200 hover:bg-white/80 hover:text-slate-700 active:scale-95"
          style={subtleButtonStyle}
          title="Hướng dẫn"
        >
          <img src="/background/faq.svg" alt="Hướng dẫn" className="w-5 h-5" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 font-medium text-lg transition-all duration-200 hover:bg-white/80 hover:text-slate-700 active:scale-95"
          style={subtleButtonStyle}
          title="Cài đặt"
        >
          <img src="/background/setting.svg" alt="Cài đặt" className="w-5 h-5" />
        </button>
      </div>

      {/* FAQ Popup */}
      {showFAQ && <FAQPopup onClose={() => setShowFAQ(false)} />}

      {/* Settings Popup */}
      {showSettings && (
        <SettingsPopup
          onClose={() => setShowSettings(false)}
          bgVolume={bgVolume}
          setBgVolume={setBgVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
        />
      )}
    </>
  );
}

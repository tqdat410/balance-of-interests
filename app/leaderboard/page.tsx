"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import LeaderboardSettingsPopup from "./LeaderboardSettingsPopup";

interface LeaderboardEntry {
  id: number;
  session_id: string;
  name: string;
  final_round: number;
  total_action: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  start_time: string;
  end_time: string;
  duration: number;
  ending: string;
  created_at: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [showRankInfo, setShowRankInfo] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(5);
  // Settings Volume are loaded but popup is removed, keeping logic for music/sfx if we want to retain background music
  const [bgVolume, setBgVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  // Input states (user is typing/selecting)
  const [dateFromInput, setDateFromInput] = useState<Date | null>(null);
  const [dateToInput, setDateToInput] = useState<Date | null>(null);
  // Applied filter states (used for actual API calls)
  const [appliedDateFrom, setAppliedDateFrom] = useState<Date | null>(null);
  const [appliedDateTo, setAppliedDateTo] = useState<Date | null>(null);
  const itemsPerPage = 10;

  // Check if there are pending filter changes
  const hasFilterChanges = 
    dateFromInput?.getTime() !== appliedDateFrom?.getTime() || 
    dateToInput?.getTime() !== appliedDateTo?.getTime();
  const hasActiveFilters = appliedDateFrom !== null || appliedDateTo !== null;

  const fetchLeaderboard = useCallback(async (isManualReload = false) => {
    if (isManualReload) {
      setIsReloading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Build request body with optional date filters (use applied filters, not input)
      const requestBody: {
        page_number: number;
        page_size: number;
        date_from?: string;
        date_to?: string;
      } = {
        page_number: currentPage,
        page_size: itemsPerPage,
      };

      // Add date filters if provided (convert to ISO with timezone)
      if (appliedDateFrom) {
        requestBody.date_from = appliedDateFrom.toISOString();
      }
      if (appliedDateTo) {
        // Use exact selected time
        requestBody.date_to = appliedDateTo.toISOString();
      }

      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch leaderboard");
      }

      const data = result.data;

      if (!data || data.length === 0) {
        setEntries([]);
        setTotalCount(0);
        return;
      }

      const totalCount = result.pagination?.totalCount || 0;
      setTotalCount(totalCount);

      const records = data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ total_count, ...record }: LeaderboardEntry & { total_count?: number }) => record
      );
      setEntries(records);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : null;
      setError(
        message || "Không thể tải bảng xếp hạng. Vui lòng thử lại sau."
      );
    } finally {
      if (isManualReload) {
        setIsReloading(false);
      } else {
        setLoading(false);
      }
    }
  }, [currentPage, appliedDateFrom, appliedDateTo]);

  // Apply filters handler
  const handleApplyFilters = () => {
    setAppliedDateFrom(dateFromInput);
    setAppliedDateTo(dateToInput);
    setCurrentPage(1);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setDateFromInput(null);
    setDateToInput(null);
    setAppliedDateFrom(null);
    setAppliedDateTo(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Load settings from localStorage on mount (client-side only) to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRefresh = localStorage.getItem("leaderboard_autoRefresh");
      if (savedRefresh === "true") setAutoRefresh(true);

      const savedBg = localStorage.getItem("leaderboard_bgVolume");
      if (savedBg !== null) setBgVolume(parseFloat(savedBg));
      
      const savedSfx = localStorage.getItem("leaderboard_sfxVolume");
      if (savedSfx !== null) setSfxVolume(parseFloat(savedSfx));
    }
  }, []);

  // Auto-refresh countdown effect (every 5 seconds when enabled)
  useEffect(() => {
    if (autoRefresh) {
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            fetchLeaderboard(true);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setCountdown(5);
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [autoRefresh, fetchLeaderboard]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper for Glassmorphism styles
  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)", // More opaque for readability
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.8)"
  };

  const glassContainerStyle = {
    background: "rgba(255, 255, 255, 0.35)", // Lighter for main container
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.6)"
  };

  // Enable native scrolling for this page
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.touchAction = "auto";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // Initialize audio
  useEffect(() => {
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
  }, []);

  // Update background music volume
  useEffect(() => {
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
  }, [bgVolume]);

  // Update SFX volume
  useEffect(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = sfxVolume;
    }
  }, [sfxVolume]);

  // Save settings to localStorage (SEPARATE keys from main game)
  useEffect(() => {
    localStorage.setItem("leaderboard_bgVolume", bgVolume.toString());
  }, [bgVolume]);

  useEffect(() => {
    localStorage.setItem("leaderboard_sfxVolume", sfxVolume.toString());
  }, [sfxVolume]);

  useEffect(() => {
    localStorage.setItem("leaderboard_autoRefresh", autoRefresh.toString());
  }, [autoRefresh]);

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/background/bg_leaderboard.jpg')",
        }} 
      />
      
      {/* Overlay Gradient for better text readability at bottom */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />

      {/* Navigation & Actions Header - Simplified */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-8 pb-2 flex justify-center items-center">
        {/* Title - Clean & Solid Gold Style matching GameOver */}
        <h1 className="hidden md:block text-8xl xl:text-7xl font-bold text-amber-500 tracking-tight mb-4 drop-shadow-sm mt-2"
            style={{ 
              textShadow: "1px 1px 0px #FFF, -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF" 
            }}
        >
          BẢNG XẾP HẠNG
        </h1>
      </div>

      <div className="md:hidden text-center mb-6 relative z-10 mt-8">
         <h1 className="text-6xl font-bold text-amber-500 tracking-tight" style={{ textShadow: "1px 1px 0px #FFF" }}>XẾP HẠNG</h1>
      </div>

      {/* Main Content Area - Glass Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-8 mt-12 xl:mt-20">
        <div 
          className="w-full rounded-[40px] p-4 md:p-8 min-h-[60vh] transition-all duration-500 relative"
          style={glassContainerStyle}
        >
          {/* Controls Bar: Home (Left) - Filter & Pagination & Refresh (Right) */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Home Link - Simple Text */}
            <Link
              href="/"
              className="text-slate-700 font-bold text-lg hover:text-amber-600 transition-colors flex items-center gap-2 px-2 flex-shrink-0"
            >
              <span>⭠ Trang chủ</span>
            </Link>

            {/* Filter, Pagination & Refresh - All in one row */}
            {!loading && !error && (
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-3">
                {/* From Date */}
                <div className="flex items-center gap-1">
                  <label className="text-sm font-bold text-slate-600 whitespace-nowrap">Từ:</label>
                  <DatePicker
                    selected={dateFromInput}
                    onChange={(date: Date | null) => setDateFromInput(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="--/--/---- --:--"
                    className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent w-[100px]"
                    wrapperClassName="w-[100px]"
                  />
                </div>

                {/* To Date */}
                <div className="flex items-center gap-1">
                  <label className="text-sm font-bold text-slate-600 whitespace-nowrap">Đến:</label>
                  <DatePicker
                    selected={dateToInput}
                    onChange={(date: Date | null) => setDateToInput(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="--/--/---- --:--"
                    className="px-2 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent w-[100px]"
                    wrapperClassName="w-[100px]"
                  />
                </div>

                {/* Filter Action Buttons */}
                <button
                  onClick={handleApplyFilters}
                  disabled={!hasFilterChanges && !dateFromInput && !dateToInput}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    hasFilterChanges
                      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                      : "bg-white/40 text-slate-400 cursor-not-allowed"
                  }`}
                  title="Áp dụng bộ lọc"
                >
                  Lọc
                </button>

                {(hasActiveFilters || dateFromInput || dateToInput) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-300 transition-all"
                    title="Xóa bộ lọc"
                  >
                    Xóa
                  </button>
                )}

                {/* Active Filter Indicator */}
                {hasActiveFilters && (
                  <span className="text-xs text-green-600 font-bold">✓</span>
                )}

                {/* Separator */}
                <div className="hidden md:block w-px h-6 bg-slate-300 mx-1" />

                {/* Total Count Badge */}
                <div className="flex px-3 py-1.5 rounded-lg bg-white/40 border border-white/60 items-center justify-center shadow-sm backdrop-blur-sm mx-1">
                  <span className="text-xs font-bold text-slate-500 mr-1">Tổng:</span>
                  <span className="text-lg font-black text-amber-600 leading-none">{totalCount}</span>
                </div>

                {/* Separator */}
                <div className="hidden md:block w-px h-6 bg-slate-300 mx-1" />

                {/* Pagination */}
                {totalCount > itemsPerPage && (
                  <div className="flex items-center gap-2 bg-white/40 rounded-lg p-1 backdrop-blur-sm shadow-sm border border-white/40">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white/60 text-slate-700 font-bold text-sm hover:bg-white disabled:opacity-30 transition-all"
                    >
                      ←
                    </button>
                    <span className="text-xs font-bold text-slate-700 min-w-[50px] text-center">
                      {currentPage} / {Math.ceil(totalCount / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalCount / itemsPerPage), p + 1))}
                      disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white/60 text-slate-700 font-bold text-sm hover:bg-white disabled:opacity-30 transition-all"
                    >
                      →
                    </button>
                  </div>
                )}

                {/* Refresh Button */}
                <button
                  onClick={() => {
                    fetchLeaderboard(true);
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:bg-white hover:text-amber-600 transition-all shadow-sm border border-white/40 ${
                    autoRefresh ? "bg-amber-100 border-amber-300" : "bg-white/40"
                  }`}
                  title={autoRefresh ? `Tự động làm mới sau ${countdown}s` : "Tải lại"}
                  disabled={isReloading}
                >
                  {autoRefresh ? (
                    <span className="text-sm font-bold text-amber-600">{countdown}</span>
                  ) : (
                    <span className={`text-lg transition-transform duration-500 ${isReloading ? "animate-spin" : ""}`}>↻</span>
                  )}
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 text-slate-700 hover:bg-white hover:text-amber-600 transition-all shadow-sm border border-white/40"
                  title="Cài đặt"
                >
                  <img src="/background/setting.svg" alt="Cài đặt" className="w-5 h-5" />
                </button>

              </div>
            )}
          </div>

          {loading && !isReloading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-white border-t-amber-500 rounded-full animate-spin shadow-lg" />
              <p className="text-slate-700 font-bold animate-pulse">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-red-600 font-bold mb-4 bg-white/50 inline-block px-4 py-2 rounded-lg">{error}</p>
              <br/>
              <button
                onClick={() => fetchLeaderboard(false)}
                className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg hover:shadow-xl hover:bg-amber-600 transition-all active:scale-95"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-medium text-xl bg-white/40 rounded-3xl">
                  Chưa có dữ liệu nào. Hãy là người đầu tiên ghi danh!
                </div>
              ) : (
                entries.map((entry, index) => {
                  const globalRank = (currentPage - 1) * itemsPerPage + index;
                  const isTop1 = globalRank === 0;
                  const isTop2 = globalRank === 1;
                  const isTop3 = globalRank === 2;
                  
                  return (
                    <div 
                      key={entry.id}
                      className="group flex flex-col md:flex-row items-center gap-4 p-4 px-6 md:py-4 rounded-3xl transition-all duration-300 hover:scale-[1.01] hover:z-10 relative overflow-hidden"
                      style={{
                        background: isTop1 ? "rgba(255, 251, 235, 0.9)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.05)",
                        border: isTop1 ? "2px solid #FCD34D" : "1px solid rgba(255,255,255,0.6)"
                      }}
                    >
                      {/* Rank Badge - Simplified */}
                      <div className="flex-shrink-0 relative">
                        <div 
                          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl font-black text-lg md:text-xl shadow-sm border border-white/50
                            ${isTop1 ? "bg-amber-400 text-white" : 
                              isTop2 ? "bg-slate-300 text-slate-600" : 
                              isTop3 ? "bg-orange-300 text-white" : 
                              "bg-slate-100 text-slate-500"}`}
                        >
                          {globalRank + 1}
                        </div>
                      </div>

                      {/* Player Info - Clean Text */}
                      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
                        <h3 className="text-lg md:text-xl font-black text-slate-800 truncate w-full max-w-[200px] md:max-w-xs leading-tight">
                          {entry.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-bold mt-0.5">
                          {(() => {
                            const d = new Date(entry.created_at);
                            const time = d.toLocaleTimeString('vi-VN', { hour12: false });
                            const date = d.toLocaleDateString('vi-VN');
                            return `${time} ${date}`;
                          })()}
                        </p>
                      </div>

                      {/* Key Stats - Minimalist Layout */}
                      <div className="flex items-center justify-center gap-6 md:gap-10 w-full md:w-auto mt-2 md:mt-0">
                        
                        {/* Round */}
                        <div className="flex flex-col items-center">
                          <span className="text-[12px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Vòng</span>
                          <span className="text-2xl font-black text-purple-600 leading-none">{entry.final_round}<span className="text-xl text-purple-300">/30</span></span>
                        </div>

                        {/* Total Actions */}
                        <div className="flex flex-col items-center">
                          <span className="text-[12px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Hành động</span>
                          <span className="text-2xl font-black text-blue-600 leading-none">{entry.total_action}</span>
                        </div>

                        {/* Time */}
                        <div className="flex flex-col items-center min-w-[60px]">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Thời gian</span>
                          <span className="text-xl font-bold text-slate-600 leading-none">{formatDuration(entry.duration)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Popup */}
      {showSettings && (
        <LeaderboardSettingsPopup
          onClose={() => setShowSettings(false)}
          bgVolume={bgVolume}
          setBgVolume={setBgVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />
      )}
    </div>
  );
}

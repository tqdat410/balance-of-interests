"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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
  const itemsPerPage = 10;

  const fetchLeaderboard = useCallback(async (isManualReload = false) => {
    if (isManualReload) {
      setIsReloading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Call Next.js API route (no credentials exposed to client)
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_number: currentPage,
          page_size: itemsPerPage,
        }),
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

      // Extract total count from pagination info
      const totalCount = result.pagination?.totalCount || 0;
      console.log("Total count:", totalCount, "Items per page:", itemsPerPage);
      setTotalCount(totalCount);

      // Remove total_count field from records
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
      console.error("Error fetching leaderboard:", err);
    } finally {
      if (isManualReload) {
        setIsReloading(false);
      } else {
        setLoading(false);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background/bg_leaderboard.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Back Button - Top Left */}
      <div className="absolute top-5 left-5 z-50">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 text-lg"
        >
          ← Trang chủ
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mt-8">
          <h1 className="text-7xl text-amber-500 mb-4"> Bảng🏆Xếp Hạng</h1>
          <p className="text-xl text-slate-600">Top người chơi xuất sắc nhất</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-2xl text-slate-600">Đang tải...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-500">{error}</p>
            <button
              onClick={() => fetchLeaderboard(false)}
              className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Reload Button and Top Pagination */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-4">
            {/* Pagination - Top Left */}
            {totalCount > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-bold text-xl"
                >
                  &lt;
                </button>
                <span className="text-lg text-slate-700 font-semibold min-w-20 text-center">
                  {currentPage}/{Math.ceil(totalCount / itemsPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(totalCount / itemsPerPage), p + 1)
                    )
                  }
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                  className="w-10 h-10 flex items-center justify-center bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-bold text-xl"
                >
                  &gt;
                </button>
              </div>
            ) : (
              <div></div>
            )}

            {/* Reload Button - Top Right */}
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchLeaderboard(true);
              }}
              className={`p-3 bg-amber-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                isReloading ? "opacity-70 cursor-wait" : "hover:bg-amber-600"
              }`}
              title="Tải lại"
              disabled={isReloading}
            >
              <svg
                className={`w-5 h-5 ${isReloading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-amber-400">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-500 text-white">
                  <tr>
                    <th className="px-4 py-4 text-center text-xl">Hạng</th>
                    <th className="px-4 py-4 text-left text-xl">Tên</th>
                    <th className="px-4 py-4 text-center text-xl">Vòng</th>
                    <th className="px-4 py-4 text-center text-xl">N - D - L</th>
                    <th className="px-4 py-4 text-center text-xl">Hành động</th>
                    <th className="px-4 py-4 text-center text-xl">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-slate-500 text-xl"
                      >
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => {
                      const globalRank =
                        (currentPage - 1) * itemsPerPage + index;
                      return (
                        <tr
                          key={entry.id}
                          className={`border-b border-slate-200 hover:bg-amber-50 transition-colors ${
                            globalRank < 3 ? "bg-amber-50 text-2xl" : "text-xl"
                          }`}
                        >
                          <td className="px-4 py-4 text-center">
                            {globalRank === 0 && "🥇"}
                            {globalRank === 1 && "🥈"}
                            {globalRank === 2 && "🥉"}
                            {globalRank > 2 && `${globalRank + 1}`}
                          </td>
                          <td className="px-4 py-4 text-slate-700">
                            {entry.name}
                          </td>
                          <td className="px-4 py-4 text-center text-purple-600">
                            {entry.final_round}/30
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-red-600 font-semibold">
                              {entry.gov_bar}
                            </span>
                            {" - "}
                            <span className="text-blue-600 font-semibold">
                              {entry.bus_bar}
                            </span>
                            {" - "}
                            <span className="text-green-600 font-semibold">
                              {entry.wor_bar}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center text-slate-600">
                            {entry.total_action}
                          </td>
                          <td className="px-4 py-4 text-center text-slate-600">
                            {formatDuration(entry.duration)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Button */}
      </div>
    </div>
  );
}

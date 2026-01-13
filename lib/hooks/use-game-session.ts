/**
 * useGameSession - Session and score submission management
 *
 * Handles: session IDs, anti-cheat signatures, score submission
 * Extracted from app/page.tsx
 */

"use client";

import { useCallback, useRef } from "react";
import type { Bars, EndingType } from "@/lib/types/game";

interface ScoreSubmitData {
  sessionId: string;
  gameSessionId: string;
  playerName: string;
  round: number;
  totalActions: number;
  bars: Bars;
  gameStartTime: number;
  endingType: EndingType;
  resultState: "gameOver" | "victory";
}

interface UseGameSessionReturn {
  submitScore: (data: ScoreSubmitData) => Promise<void>;
  generateClientSignature: (data: SignatureData) => Promise<string>;
  canSubmit: boolean;
  resetSubmitFlag: () => void;
}

interface SignatureData {
  game_session_id: string;
  final_round: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  duration: number;
  ending: string;
}

export function useGameSession(): UseGameSessionReturn {
  const submitScoreRef = useRef(false);

  // Generate HMAC signature client-side
  const generateClientSignature = useCallback(
    async (data: SignatureData): Promise<string> => {
      const secret = process.env.NEXT_PUBLIC_GAME_SECRET || "default_secret";
      const message = [
        data.game_session_id,
        data.final_round,
        data.gov_bar,
        data.bus_bar,
        data.wor_bar,
        data.duration,
        data.ending,
      ].join("|");

      // Use Web Crypto API for HMAC-SHA256
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const msgData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
      return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    },
    []
  );

  // Submit score
  const submitScore = useCallback(
    async (data: ScoreSubmitData): Promise<void> => {
      // Prevent duplicate submissions
      if (submitScoreRef.current) {
        return;
      }

      submitScoreRef.current = true;

      const gameDuration = Math.floor((Date.now() - data.gameStartTime) / 1000);
      const ending =
        data.resultState === "gameOver"
          ? "FAILED"
          : data.endingType === "harmony"
          ? "HARMONY"
          : "SURVIVAL";

      const gameData = {
        game_session_id: data.gameSessionId,
        final_round: data.round,
        gov_bar: data.bars.Government,
        bus_bar: data.bars.Businesses,
        wor_bar: data.bars.Workers,
        duration: gameDuration,
        ending: ending,
      };

      // Generate HMAC signature
      const signature = await generateClientSignature(gameData);

      const payload = {
        session_id: data.sessionId,
        game_session_id: data.gameSessionId,
        name: data.playerName.trim(),
        final_round: data.round,
        total_action: data.totalActions,
        gov_bar: data.bars.Government,
        bus_bar: data.bars.Businesses,
        wor_bar: data.bars.Workers,
        start_time: new Date(data.gameStartTime).toISOString(),
        end_time: new Date().toISOString(),
        duration: gameDuration,
        ending: ending,
        signature: signature,
      };

      try {
        const response = await fetch("/api/submit-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to submit score");
        }
      } catch {
        // Silent fail - reset flag to allow retry
        submitScoreRef.current = false;
      }
    },
    [generateClientSignature]
  );

  // Reset submit flag
  const resetSubmitFlag = useCallback(() => {
    submitScoreRef.current = false;
  }, []);

  return {
    submitScore,
    generateClientSignature,
    canSubmit: !submitScoreRef.current,
    resetSubmitFlag,
  };
}

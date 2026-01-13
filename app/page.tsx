"use client";

import React from "react";
import MainMenu from "./components/MainMenu";
import GameOverScreen from "./components/GameOverScreen";
import VictoryScreen from "./components/VictoryScreen";
import GamePlayArea from "./components/GamePlayArea";
import EventPopup from "./components/EventPopup";
import { useGameState } from "@/lib/hooks/useGameState";

export default function BalanceOfInterests() {
  const {
    gameState,
    round,
    bars,
    currentEntity,
    turnOrder,
    turnIndex,
    history,
    endingType,
    eventMessage,
    currentEvent,
    showEventPopup,
    startButtonAnimating,
    startClickAnimation,
    menuFadingOut,
    endingFadingIn,
    showFAQ,
    setShowFAQ,
    playerName,
    setPlayerName,
    showNameInput,
    inputShaking,
    validateAndStartGame,
    startGame,
    handleEventContinue,
    handleEventSkip,
    handleEventExecute,
    handleAction,
    handleActionComplete,
    availableActions,
  } = useGameState();

  if (gameState === "menu") {
    return (
      <MainMenu
        startGame={startGame}
        validateAndStartGame={validateAndStartGame}
        playerName={playerName}
        setPlayerName={setPlayerName}
        showNameInput={showNameInput}
        startButtonAnimating={startButtonAnimating}
        startClickAnimation={startClickAnimation}
        menuFadingOut={menuFadingOut}
        showFAQ={showFAQ}
        setShowFAQ={setShowFAQ}
        inputShaking={inputShaking}
      />
    );
  }

  if (gameState === "gameOver") {
    return (
      <GameOverScreen
        startGame={startGame}
        startButtonAnimating={startButtonAnimating}
        startClickAnimation={startClickAnimation}
        menuFadingOut={menuFadingOut}
        endingFadingIn={endingFadingIn}
      />
    );
  }

  if (gameState === "victory") {
    return (
      <VictoryScreen
        startGame={startGame}
        startButtonAnimating={startButtonAnimating}
        startClickAnimation={startClickAnimation}
        menuFadingOut={menuFadingOut}
        endingFadingIn={endingFadingIn}
        endingType={endingType}
        round={round}
        bars={bars}
      />
    );
  }

  // Game playing - min-h-screen with safe padding for laptop screens
  return (
    <div className="min-h-screen w-full bg-[var(--clay-bg)] relative overflow-auto">
      {/* Decorative Circles for Game Screen - responsive sizing */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 xl:w-[500px] xl:h-[500px] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 xl:w-[500px] xl:h-[500px] bg-amber-200/20 rounded-full blur-3xl" />
      </div>
      
      {/* Add vertical padding for safe area on all screens */}
      <div className="relative z-10 w-full min-h-screen py-3 md:py-4 xl:py-6">
        <GamePlayArea
          history={history}
          bars={bars}
          round={round}
          turnIndex={turnIndex}
          currentEntity={currentEntity}
          turnOrder={turnOrder}
          availableActions={availableActions}
          handleAction={handleAction}
          eventMessage={eventMessage}
          handleActionComplete={handleActionComplete}
        />
      </div>

      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup
          event={currentEvent}
          onContinue={handleEventContinue}
          onSkip={handleEventSkip}
          onExecute={handleEventExecute}
          round={round}
        />
      )}
    </div>
  );
}

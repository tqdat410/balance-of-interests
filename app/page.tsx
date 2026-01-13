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

  // Game playing - fixed viewport, no scroll, content must fit
  // Uses h-dvh (dynamic viewport height) with h-screen fallback for browser compatibility
  return (
    <div className="h-screen h-[100dvh] w-full bg-[var(--clay-bg)] relative overflow-hidden">
      {/* Decorative Circles for Game Screen - responsive sizing */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 xl:w-[500px] xl:h-[500px] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 xl:w-[500px] xl:h-[500px] bg-amber-200/20 rounded-full blur-3xl" />
      </div>
      
      {/* Content container - uses full height with safe padding */}
      <div className="relative z-10 w-full h-full flex flex-col py-2 md:py-3 xl:py-4">
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

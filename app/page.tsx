"use client";

import React from "react";
import MainMenu from "./components/MainMenu";
import GameOverScreen from "./components/GameOverScreen";
import VictoryScreen from "./components/VictoryScreen";
import GamePlayArea from "./components/GamePlayArea";
import EventPopup from "./components/EventPopup";
import GameControlButtons from "./components/GameControlButtons";
import LoadingScreen from "./components/LoadingScreen";
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
    handleEventAccept,
    handleReroll,
    rerollCount,
    handleAction,
    handleActionComplete,
    availableActions,
  } = useGameState();

  const renderContent = () => {
    if (gameState === "menu") {
      return (
        <div className="fixed inset-0 w-full h-full overflow-y-auto lg:overflow-hidden landscape-scroll">
          <MainMenu
            startGame={startGame}
            validateAndStartGame={validateAndStartGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            showNameInput={showNameInput}
            startButtonAnimating={startButtonAnimating}
            startClickAnimation={startClickAnimation}
            menuFadingOut={menuFadingOut}
            inputShaking={inputShaking}
          />
          <GameControlButtons showOnMenu={true} />
        </div>
      );
    }

    if (gameState === "gameOver") {
      return (
        <div className="fixed inset-0 w-full h-full overflow-y-auto lg:overflow-hidden landscape-scroll">
          <GameOverScreen
            startGame={startGame}
            startButtonAnimating={startButtonAnimating}
            startClickAnimation={startClickAnimation}
            menuFadingOut={menuFadingOut}
            endingFadingIn={endingFadingIn}
          />
        </div>
      );
    }

    if (gameState === "victory") {
      return (
        <div className="fixed inset-0 w-full h-full overflow-y-auto lg:overflow-hidden landscape-scroll">
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
        </div>
      );
    }

    return (
      <div className="min-h-screen min-h-[100dvh] w-full bg-[var(--clay-bg)] relative overflow-y-auto lg:overflow-hidden landscape-scroll">
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
            rerollCount={rerollCount}
            onReroll={handleReroll}
          />
        </div>

        {/* Game Control Buttons (Help + Settings) - bottom-left */}
        <GameControlButtons />

        {/* Event Popup */}
        {showEventPopup && currentEvent && (
          <EventPopup
            event={currentEvent}
            onContinue={handleEventContinue}
            onSkip={handleEventSkip}
            onExecute={handleEventExecute}
            onAccept={handleEventAccept}
            round={round}
            bars={bars}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <LoadingScreen onLoadComplete={() => {}} />
      {renderContent()}
    </>
  );
}

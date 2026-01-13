# Phase 1: Structure Refactor & Modularization

## Objectives

- Deconstruct the monolithic `app/page.tsx` (1200+ lines).
- Extract game constants/data (Entities, Actions, Events) into dedicated config files.
- Extract game logic/state into a custom hook `useGameState`.
- Break down the UI into smaller, focused components (e.g., `GameHeader`, `GameStatus`, `MainMenu`, `EndScreen`).

## Tasks

### 1. Extract Configuration
- Move `ENTITIES`, `ACTIONS`, `EVENTS`, `INITIAL_BARS` to `lib/config/gameData.ts` (or similar).
- Ensure types are exported from `lib/types/game.ts`.

### 2. Extract Logic Hook
- Create `lib/hooks/useGameState.ts`.
- Move all `useState`, `useEffect`, `handleAction`, `checkGameOver`, `submitScore` logic there.
- Return necessary state and handlers.

### 3. Component Extraction
- Extract `MainMenu` component.
- Extract `GameOverScreen` / `VictoryScreen` components.
- Extract `GameHUD` (Header, Status Bars).
- Extract `GamePlayArea` (Chart + Action Buttons).

### 4. Refactor `page.tsx`
- Import the hook and components.
- Compose the main page.

## Output
- Clean `app/page.tsx`.
- Organized `lib/` folder.
- Reusable components in `app/components/`.

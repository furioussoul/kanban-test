---
name: game-refactor
description: Guidelines and architecture for refactoring the Plane Shooter game into an engine-driven React app.
---

# Plane Shooter Refactoring Guide (Completed)

This refactoring has been completed. The project now follows an Engine-Driven Architecture.

## 1. Updated Architecture
- **`src/types.ts`**: Centralized TypeScript interfaces.
- **`src/constants.ts`**: Game configuration (speeds, sizes, spawn rates).
- **`src/hooks/useGameEngine.ts`**: Core logic, game loop (RAF), and input handling.
- **`src/components/`**: Pure functional components for rendering.

## 2. Key Improvements
- **Performance**: High-frequency rendering is optimized with `React.memo` and centralized updates.
- **Input**: Added WASD and Arrow key support alongside mouse/touch.
- **Maintainability**: Logic is separated from UI. Constants are no longer hardcoded.

## 3. Maintenance Guide
- To change game speed, modify `src/constants.ts`.
- To add new enemy types, update `GameObject` in `src/types.ts` and handle logic in `useGameEngine.ts`.

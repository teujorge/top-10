"use client";

import { useGame } from "./hooks/useGame";
import { GamePlay } from "./components/game-play";
import { GameSetup } from "./components/game-setup";
import { useEffect } from "react";

export function Game({ ai, category }: { ai: boolean; category: string }) {
  const game = useGame();

  useEffect(() => {
    game.setAi(ai);
    game.setCategory(category);
  }, [ai, category, game]);

  return game.settingUp ? <GameSetup /> : <GamePlay />;
}

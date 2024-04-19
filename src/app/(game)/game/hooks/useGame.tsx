"use client";

import { ChatCompletionMessageParam } from "ai/prompts";
import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type ListItem = {
  item: string;
  player: string | undefined;
};

type GameContextType = {
  ai: boolean;
  setAi: Dispatch<SetStateAction<boolean>>;

  category: string;
  setCategory: Dispatch<SetStateAction<string>>;

  moderator: boolean;
  setModerator: Dispatch<SetStateAction<boolean>>;

  players: string[];
  setPlayers: Dispatch<SetStateAction<string[]>>;

  settingUp: boolean;
  setSettingUp: Dispatch<SetStateAction<boolean>>;

  list: ListItem[];
  setList: Dispatch<SetStateAction<ListItem[]>>;

  currentPlayerIndex: number;
  setCurrentPlayerIndex: Dispatch<SetStateAction<number>>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  // setup
  const [ai, setAi] = useState(false);
  const [category, setCategory] = useState("");
  const [moderator, setModerator] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [settingUp, setSettingUp] = useState(true);

  // game play
  const [list, setList] = useState<ListItem[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  return (
    <GameContext.Provider
      value={{
        // game setup
        ai,
        setAi,
        category,
        setCategory,
        moderator,
        setModerator,
        players,
        setPlayers,
        settingUp,
        setSettingUp,
        // game play
        list,
        setList,
        currentPlayerIndex,
        setCurrentPlayerIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

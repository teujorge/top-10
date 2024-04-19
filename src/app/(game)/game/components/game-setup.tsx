"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGame } from "../hooks/useGame";
import { useEffect, useRef, useState } from "react";

export function GameSetup() {
  const playersCardRef = useRef<HTMLDivElement>(null);

  const game = useGame();

  const [input, setInput] = useState("");
  const [lastPlayersLength, setLastPlayersLength] = useState(
    game.players.length
  );

  useEffect(() => {
    setLastPlayersLength(game.players.length);

    if (game.players.length <= lastPlayersLength) return;

    playersCardRef.current?.scrollTo({
      top: playersCardRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [game.players.length, lastPlayersLength]);

  function handleAddPlayer() {
    if (input.trim() === "") {
      toast.error("Player name cannot be empty");
      return;
    }
    if (game.players.includes(input)) {
      toast.error("Player name already exists");
      return;
    }
    if (game.players.length >= 10) {
      toast.error("Maximum number of players reached");
      return;
    }

    game.setPlayers([...game.players, input]);
    setInput("");
  }

  return (
    <main className="full-screen flex flex-col items-center justify-between text-center">
      <section className="w-full pb-4">
        <h1 className="text-lg w-full border-b border-accent pb-4">
          Game Setup
        </h1>
      </section>

      <section
        ref={playersCardRef}
        className="gap-2 flex flex-col max-w-3xl w-full h-full overflow-x-hidden overflow-y-auto"
      >
        {game.players.map((player, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between p-2 border border-accent rounded-lg w-full text-left"
          >
            <p>
              <span className="text-sm text-muted-foreground">
                Player {index + 1}:
              </span>
              <span className="text-lg"> {player}</span>
            </p>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                game.setPlayers(game.players.filter((_, i) => i !== index))
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className="py-4 flex gap-2 w-full max-w-3xl mx-auto items-center">
        <Input
          className="flex-1 min-h-[40px]"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddPlayer();
          }}
          placeholder="Enter player name..."
        />
        <Button variant="ghost" onClick={handleAddPlayer}>
          Add
        </Button>
        <Button variant="outline" onClick={() => game.setSettingUp(false)}>
          Start
        </Button>
      </section>
    </main>
  );
}

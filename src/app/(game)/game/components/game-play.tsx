"use client";

import OpenAI from "openai";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGame } from "../hooks/useGame";
import { useEffect, useState } from "react";

export function GamePlay() {
  const {
    category,
    list,
    setList,
    players,
    currentPlayerIndex,
    setCurrentPlayerIndex,
  } = useGame();

  const [input, setInput] = useState("");

  useEffect(() => {
    async function initAiModerator() {
      const { res, data } = await moderator({ category });

      if (res.ok) {
        setInput("");
      } else {
        toast.error("Failed to submit guess... Please try again.");
        return;
      }

      const dataListWrapper = data?.choices[0].message.content;
      console.log("DATA LIST:", dataListWrapper);

      if (!dataListWrapper) {
        toast.error("Failed to initialize... Please try again.");
        return;
      }

      // dataList should now be a string (json) that contains a list a single field that contains a list of strings

      const dataList: { list: string[] } = JSON.parse(dataListWrapper);

      setList(dataList.list.map((li) => ({ item: li, player: undefined })));
    }

    initAiModerator();
  }, [setList, category]);

  async function handleGuess() {
    const { res, data } = await moderator({
      guess: input,
      list: list.map((li) => li.item),
    });

    if (!res.ok) {
      toast.error("Failed to submit guess... Please try again.");
      return;
    }

    const dataGuess = data?.choices[0].message.content;
    console.log("DATA GUESS:", dataGuess);

    if (!dataGuess) {
      toast.error("Failed to submit guess... Please try again.");
      return;
    }

    const guessFeedback: {
      correct: boolean | null;
      suggestions: string[] | null;
    } = JSON.parse(dataGuess);
    console.log("GUESS:", guessFeedback);

    // give word suggestions to player
    if (guessFeedback.suggestions) {
      toast.info(`Suggestions: ${guessFeedback.suggestions.join(", ")}`, {
        duration: 10000,
      });
    }

    // guess feedback
    else {
      setInput("");

      // correct guess
      if (guessFeedback.correct === true) {
        toast.success("Correct guess!");
        setList((prevList) =>
          prevList.map((li) => {
            if (li.item === input) {
              return { item: li.item, player: players[currentPlayerIndex] };
            }
            return li;
          })
        );
      }

      // incorrect guess
      else if (guessFeedback.correct === false) {
        toast.error("Incorrect guess... Next player!");
      }

      // next player
      setCurrentPlayerIndex((prevIndex) =>
        prevIndex + 1 >= players.length ? 0 : prevIndex + 1
      );
    }
  }

  useEffect(() => {
    console.log("HERE:", list);
  }, [list]);

  return list.length === 0 ? (
    <main>LOADING...</main>
  ) : (
    <main className="full-screen flex flex-col items-center justify-between text-center">
      <section className="max-w-3xl w-full flex flex-col gap-2 h-full overflow-x-hidden overflow-y-auto">
        <h1>Category: {category}</h1>

        <p className="text-left rounded-lg px-4 py-2 border w-full border-primary">
          <span className="text-sm text-muted-foreground">
            Player {currentPlayerIndex + 1}:
          </span>
          <span className="text-lg"> {players[currentPlayerIndex]}</span>
        </p>
      </section>

      <section className="py-4 flex w-full max-w-3xl mx-auto items-center">
        <Input
          className="flex-1 min-h-[40px]"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your guess..."
        />
        <Button className="ml-2" onClick={handleGuess}>
          Guess
        </Button>
      </section>
    </main>
  );
}

type ModeratorInput =
  | {
      guess: string;
      list: string[];
    }
  | {
      category: string;
    };

async function moderator(input: ModeratorInput) {
  const res = await fetch("/api/moderator", {
    method: "POST",
    body: JSON.stringify({ ...input }),
  });

  if (!res.ok) {
    return { res, data: undefined };
  }

  const data: OpenAI.Chat.Completions.ChatCompletion = await res.json();

  return { res, data };
}

import React, { useState, useEffect } from "react";
import Prompt from "components/Prompt";
import TextHistory, { Element, input, output } from "components/TextHistory";
import { Game } from "game";

type Props = {};

const GameScreen: React.FC<Props> = () => {
  const [data, setData] = useState<Element[]>([]);
  const [game, setGame] = useState<Game>(new Game("Luis"));

  useEffect(() => {
    onCommand("welcome", false);
  }, []);

  function onCommand(value: string, showInput = true) {
    if (!value) return;
    const response = game.runPrompt(value);
    let text;
    if (showInput) {
      text = [...data, input(value), output(response)];
    } else {
      text = [...data, output(response)];
    }
    setData(text as Element[]);
  }

  return (
    <div className="flex flex-col justify-between border-base py-2">
      <div className="px-2 pb-2">
        <TextHistory data={data} />
      </div>
      <div className="border-t-base px-2 pt-2">
        <Prompt onCommand={onCommand} />
      </div>
    </div>
  );
};

export default GameScreen;

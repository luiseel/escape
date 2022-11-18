import React, { useState, useEffect } from "react";
import Prompt from "components/Prompt";
import TextHistory, { Element, input, output } from "components/TextHistory";
import { Game } from "game";

type Props = {};

const GameScreen: React.FC<Props> = () => {
  const game = new Game("Luis");
  const [data, setData] = useState<Element[]>([]);

  function onCommand(value: string) {
    if (!value) return;
    const response = game.runPrompt(value);
    setData([...data, input(value), output(response)] as Element[]);
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

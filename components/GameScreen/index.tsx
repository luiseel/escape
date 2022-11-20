import React, { useState, useEffect } from "react";
import Prompt from "components/Prompt";
import TextHistory, { Text, input, output } from "components/TextHistory";
import { Game } from "game";

type Props = {};

type Prompt = {
  value: string;
  showInput: boolean;
};

const GameScreen: React.FC<Props> = () => {
  const [game] = useState(new Game("Luis"));
  const [data, setData] = useState<Text[]>([]);
  const [prompt, setPrompt] = useState<Prompt>({
    value: "welcome",
    showInput: false,
  });

  useEffect(() => {
    const { value, showInput } = prompt;
    const response = game.runPrompt(value);
    if (showInput) {
      setData((data) => [...data, input(value), output(response)]);
    } else {
      setData((data) => [...data, output(response)]);
    }
  }, [prompt, game]);

  function onCommand(value: string) {
    if (!value) return;
    setPrompt({ value, showInput: true });
  }

  return (
    <div className="flex flex-col justify-between border-base">
      <div className="p-2">
        <TextHistory data={data} />
      </div>
      <div className="border-t-base p-2 bg-foreground text-background">
        <Prompt onCommand={onCommand} />
      </div>
    </div>
  );
};

export default GameScreen;

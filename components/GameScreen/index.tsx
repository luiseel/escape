import React, { useState, useEffect } from "react";
import Prompt from "components/Prompt";
import TextHistory, { Element, input, output } from "components/TextHistory";
import { CommandManager } from "game/prompt";

type Props = {};

const manager = new CommandManager("I don't understand you!");

const GameScreen: React.FC<Props> = () => {
  const [data, setData] = useState<Element[]>([]);

  useEffect(() => {
    manager.addCmd(
      "list items",
      () => `This is a list of your items:\n  * MEDICINE X 2`
    );
  }, []);

  function onCommand(value: string) {
    const response = manager.executeCmd(value);
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

import React, { useState, useEffect } from "react";
import Prompt from "components/Prompt";
import TextHistory from "components/TextHistory";
import { CommandManager } from "game/prompt";

type Props = {};

const manager = new CommandManager("I don't understand you!");

const GameScreen: React.FC<Props> = () => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    manager.addCmd("list items", () => "This are your items: ...");
  }, []);

  function onCommand(value: string) {
    const response = manager.executeCmd(value);
    setData([...data, value, response]);
  }

  return (
    <div className="flex flex-col justify-between border-2 py-2">
      <div className="px-2 pb-2">
        <TextHistory data={data} />
      </div>
      <div className="border-t-2 px-2 pt-2">
        <Prompt onCommand={onCommand} />
      </div>
    </div>
  );
};

export default GameScreen;

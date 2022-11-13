import React, { useState } from "react";
import Prompt from "components/Prompt";
import TextHistory from "components/TextHistory";

type Props = {};

const GameScreen: React.FC<Props> = () => {
  const [data, setData] = useState<string[]>([]);

  function onCommand(value: string) {
    setData([...data, value]);
  }

  return (
    <div className="flex flex-col justify-between border-2 py-2">
      <div className="px-2 pb-2 h-[400px]">
        <TextHistory data={data} />
      </div>
      <div className="border-t-2 px-2 pt-2">
        <Prompt onCommand={onCommand} />
      </div>
    </div>
  );
};

export default GameScreen;

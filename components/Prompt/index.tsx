import React, { useState } from "react";

type Props = {
  // eslint-disable-next-line no-unused-vars
  onCommand: (_: string) => void;
};

const Propmt: React.FC<Props> = ({ onCommand }) => {
  const [command, setCommand] = useState<string>("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCommand(event.target.value);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCommand(command);
    setCommand("");
  }

  return (
    <form className="flex flex-row gap-2" onSubmit={onSubmit}>
      <span>&gt;</span>
      <input
        className="bg-foreground w-full focus:outline-0"
        type="text"
        onChange={onChange}
        value={command}
      />
    </form>
  );
};

export default Propmt;

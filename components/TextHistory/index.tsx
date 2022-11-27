import React, { useEffect } from "react";

export type Text = {
  type: "in" | "out";
  text: string;
};

type Props = {
  data: Text[];
};

export function input(text: string) {
  return { type: "in", text } as Text;
}

export function output(text: string) {
  return { type: "out", text } as Text;
}

const TextHistory: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const el = document.getElementById("history");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [data]);

  return (
    <div id="history" className="h-[400px] overflow-y-scroll">
      {data.map(({ text, type }, idx) => (
        <div key={idx} className="flex flow-row gap-2">
          {type === "in" ? "> " : null}
          <span className="whitespace-pre-line">{text}</span>
        </div>
      ))}
    </div>
  );
};

export default TextHistory;

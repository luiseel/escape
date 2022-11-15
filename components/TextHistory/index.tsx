import React, { useEffect } from "react";

export type Element = {
  type: "in" | "out";
  text: string;
};

type Props = {
  data: Element[];
};

export function input(text: string) {
  return { type: "in", text } as Element;
}

export function output(text: string) {
  return { type: "out", text } as Element;
}

const TextHistory: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const el = document.getElementById("history");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [data]);

  return (
    <div id="history" className="h-[400px] overflow-y-scroll scroll-smooth">
      {data.map(({ text, type }, idx) => (
        <div key={idx}>
          <pre>
            {type === "in" ? ">" : "<"}
            {" " + text}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default TextHistory;

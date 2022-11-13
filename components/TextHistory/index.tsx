import React, { useEffect } from "react";

type Props = {
  data: string[];
};

const TextHistory: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const el = document.getElementById("history");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [data]);

  return (
    <div id="history" className="h-[400px] overflow-y-scroll scroll-smooth">
      {data.map((it, idx) => (
        <div key={idx}>{it}</div>
      ))}
    </div>
  );
};

export default TextHistory;

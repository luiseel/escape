import React from "react";

type Props = {
  data: string[];
};

const TextHistory: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((it, idx) => (
        <div key={idx}>{it}</div>
      ))}
    </>
  );
};

export default TextHistory;

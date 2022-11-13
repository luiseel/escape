import React from "react";

type Props = {
  children: React.ReactNode;
};

const Panel: React.FC<Props> = ({ children }) => {
  return <div className="border-2 p-2">{children}</div>;
};

export default Panel;

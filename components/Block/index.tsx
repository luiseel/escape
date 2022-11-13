import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Block: React.FC<Props> = ({ children }) => {
  return <div className="py-2">{children}</div>;
};

export const HCenteredBlock: React.FC<Props> = ({ children }) => {
  return <div className="flex items-center h-full">{children}</div>;
};

export default Block;

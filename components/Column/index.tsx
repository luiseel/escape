import React, { useEffect, useState } from "react";

type Props = {
  mode?: "full" | "2xl" | "xl" | "lg" | "md";
  children: React.ReactNode;
};

const modes = {
  full: "lg:w-full",
  "2xl": "lg:max-w-screen-2xl",
  xl: "lg:max-w-screen-xl",
  lg: "lg:max-w-screen-lg",
  md: "lg:max-w-screen-md",
};

const Column: React.FC<Props> = ({ mode = "xl", children }) => {
  const baseClasses = "px-4 h-full lg:mx-auto lg:px-16";

  return (
    <div className="w-full h-full">
      <div className={`${baseClasses} ${modes[mode]}`}>{children}</div>
    </div>
  );
};

export default Column;

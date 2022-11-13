import React, { useEffect, useState } from "react";

type Props = {
  mode?: "full" | "2xl" | "xl" | "lg" | "md";
  children: React.ReactNode;
};

const Column: React.FC<Props> = ({ mode = "2xl", children }: Props) => {
  const baseClasses = "px-4 h-full lg:mx-auto lg:px-16";
  const [classes, setClasses] = useState<string>();

  useEffect(() => {
    if (mode === "full") setClasses(`lg:w-full`);
    if (mode === "2xl") setClasses(`lg:max-w-screen-2xl`);
    if (mode === "xl") setClasses(`lg:max-w-screen-xl`);
    if (mode === "lg") setClasses(`lg:max-w-screen-lg`);
    if (mode === "md") setClasses(`lg:max-w-screen-md`);
  }, [mode]);

  return (
    <div className="w-full h-full">
      <div className={`${baseClasses} ${classes}`}>{children}</div>
    </div>
  );
};

export default Column;

import React from "react";
import Link from "next/link";
import Column from "components/Column";
import { HCenteredBlock as Block } from "components/Block";

type Props = {
  children: React.ReactNode;
};

export const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="fixed top-0 w-full bg-background h-[60px] border-b-2">
        <Column>
          <Block>
            <Link href="/">Escape!</Link>
          </Block>
        </Column>
      </header>

      {children}

      <footer className="border-t-2 h-[60px]">
        <Column>
          <Block>
            <span>
              Built by
              <a
                href="http://twitter.com/luiseel_"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                luiseel
              </a>
            </span>
          </Block>
        </Column>
      </footer>
    </div>
  );
};

export default DefaultLayout;

import React from "react";
import Link from "next/link";
import Column from "components/Column";
import { HCenteredBlock as Block } from "components/Block";

type Props = {
  children: React.ReactNode;
};

function Header() {
  return (
    <header className="fixed top-0 w-full bg-background h-[60px] border-b-base">
      <Column>
        <Block>
          <Link href="/">Escape!</Link>
        </Block>
      </Column>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t-base h-[60px]">
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
  );
}

export const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <main className={`mt-[60px]`}>{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

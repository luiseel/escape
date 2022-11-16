import type { AppProps } from "next/app";
import DefaultLayout from "layouts/DefaultLayout";
import "styles/globals.css";
import localFont from "@next/font/local";

const font = localFont({
  src: "../styles/04b_03.ttf.woff",
  variable: "--default-font",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/** I don't like the fact that I need to use both the class and the variable to make it to work... */}
      <div className={`${font.variable} font-sans`}>
        <DefaultLayout>
          <main className={`mt-[60px]`}>
            <Component {...pageProps} />
          </main>
        </DefaultLayout>
      </div>
    </>
  );
}

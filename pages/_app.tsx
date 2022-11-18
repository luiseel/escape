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
    <div className={`${font.variable} font-sans`}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </div>
  );
}

import type { AppProps } from "next/app";
import DefaultLayout from "layouts/DefaultLayout";
import "styles/globals.css";
import "@fontsource/vt323";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

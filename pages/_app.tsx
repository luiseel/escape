import type { AppProps } from "next/app";
import "styles/globals.css";

import "@fontsource/vt323";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

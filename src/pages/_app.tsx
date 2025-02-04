import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { pixelifySans, quantico } from "@/styles/font";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${quantico.variable} ${pixelifySans.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { pixelify, quantico } from "@/styles/font";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${quantico.variable} ${pixelify.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

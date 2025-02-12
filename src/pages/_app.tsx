import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { pixelifySans, quantico } from "@/styles/font";
import { UserProvider } from "@/components/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${quantico.variable} ${pixelifySans.variable}`}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </main>
  );
}

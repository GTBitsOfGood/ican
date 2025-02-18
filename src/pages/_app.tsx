import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { belanosima, pixelifySans, quantico } from "@/styles/font";
import { UserProvider } from "@/components/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "652062504464-p2onuoqfa412mqojrjmh27k47qqbal03.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${quantico.variable} ${pixelifySans.variable} ${belanosima.variable}`}
    >
      <GoogleOAuthProvider clientId={clientId}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </GoogleOAuthProvider>
    </main>
  );
}

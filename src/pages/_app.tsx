import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { belanosima, pixelifySans, quantico } from "@/styles/font";
import { UserProvider } from "@/components/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PetProvider } from "@/components/petContext";
import { FoodProvider } from "@/components/FoodContext";

const clientId =
  "809032743829-4ucb77e47tfhv196gkdtu2e2uj278ghl.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${quantico.variable} ${pixelifySans.variable} ${belanosima.variable}`}
    >
      <GoogleOAuthProvider clientId={clientId}>
        <UserProvider>
          <PetProvider>
            <FoodProvider>
              <Component {...pageProps} />
            </FoodProvider>
          </PetProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </main>
  );
}

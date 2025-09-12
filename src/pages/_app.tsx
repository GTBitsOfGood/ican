import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { belanosima, pixelifySans, quantico } from "@/styles/font";
import { UserProvider } from "@/components/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PetProvider } from "@/components/petContext";
import { FoodProvider } from "@/components/FoodContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const clientId =
  "809032743829-4ucb77e47tfhv196gkdtu2e2uj278ghl.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <main
      className={`${quantico.variable} ${pixelifySans.variable} ${belanosima.variable}`}
    >
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={clientId}>
          <UserProvider>
            <PetProvider>
              <FoodProvider>
                <Component {...pageProps} />
              </FoodProvider>
            </PetProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </main>
  );
}

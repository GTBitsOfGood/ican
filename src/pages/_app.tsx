import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { belanosima, pixelifySans, quantico } from "@/styles/font";
import { UserProvider } from "@/components/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FoodProvider } from "@/components/FoodContext";
import { TutorialProvider } from "@/components/TutorialContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "@/components/NotificationProvider";

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
            <NotificationProvider>
              <TutorialProvider>
                <FoodProvider>
                  <Component {...pageProps} />
                </FoodProvider>
              </TutorialProvider>
            </NotificationProvider>
          </UserProvider>
        </GoogleOAuthProvider>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </main>
  );
}

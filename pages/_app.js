import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </SessionProvider>
  );
}

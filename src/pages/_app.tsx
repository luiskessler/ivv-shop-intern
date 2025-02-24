import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "sonner";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>ivv Shop</title>
      </Head>
      <div className={GeistSans.className}>
        <Toaster />
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);

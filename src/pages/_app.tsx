import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "sonner";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Toaster />
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);

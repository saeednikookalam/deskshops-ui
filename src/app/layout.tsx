import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Deskshops - پنل مدیریت",
    default: "Deskshops - پنل مدیریت",
  },
  description:
    "پنل مدیریت دسک شاپس",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.className} overflow-x-hidden`}>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ut1traw404");
          `}
        </Script>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          {children}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '500px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid #10b981',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid #ef4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#5750F1',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

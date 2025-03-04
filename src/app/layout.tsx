import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "aide",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          {/* <Button className="fixed right-5 top-5 z-50">
            <SignOutButton />
          </Button> */}
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

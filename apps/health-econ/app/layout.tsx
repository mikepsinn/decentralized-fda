import "./globals.css";
import "@/app/styles/neobrutalist.css";

import { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/app/providers";
import { getCurrentUser } from "@/lib/session";
import { getNavigationForDomain } from "@/config/navigation";
import DfdaTopNavbar from "../components/DfdaTopNavbar";
import DFDAFooter from "../components/DFDAFooter";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@FDADAO",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({children}: RootLayoutProps) {
  const user = await getCurrentUser()
  const navigation = getNavigationForDomain("dfda.earth")
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", spaceGrotesk.className)}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-cyan-300 to-purple-400 p-4 font-mono text-black md:p-8">
              <DfdaTopNavbar
                user={{
                  name: user?.name,
                  image: user?.image,
                  email: user?.email,
                }}
                topNavItems={navigation.topNav}
                avatarNavItems={navigation.avatarNav}
              />
              <main className="flex-1">{children}</main>
            </div>
          </div>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import OfflineStatus from "@/components/OfflineStatus";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "@/styles/globals.css";
import "@/styles/layout.css";
import "@/styles/components.css";
import "@/styles/theme.css";

export const metadata: Metadata = {
  title: "Kallos Sthenos",
  description: "Personal workout planning app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kallos",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A1A1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        <OfflineStatus />
        <div className="app-layout">
          <header className="app-header">
            <h1>Kallos Sthenos</h1>
          </header>
          <div className="app-body">
            <Nav />
            <main className="app-main">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

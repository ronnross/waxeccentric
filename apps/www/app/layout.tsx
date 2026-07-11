import "../styles/globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: {
    default: "Wax Eccentric",
    template: "%s | Wax Eccentric",
  },
  description:
    "A practical exploration of metric measures and eccentric ideas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="content">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

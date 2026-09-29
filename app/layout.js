import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Planner — Post & Find Event Services",
  description: "Connect with verified event planners, performers, and production crew for your next event.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="navbar">
          <div className="navbar-container">
            <Link href="/" className="navbar-brand">
              <span className="brand-dot"></span> Event Planner
            </Link>
            <nav className="navbar-links">
              <Link href="/requirements" className="nav-link">
                Browse Requests
              </Link>
              <Link href="/post-requirement" className="nav-button">
                Post Requirement
              </Link>
            </nav>
          </div>
        </header>

        <main className="main-content">{children}</main>

        <footer className="footer">
          <div className="footer-container">
            <p>© {new Date().getFullYear()} Event Planner. Open platform for event organizers & creators.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const APP_URL = "https://www.youtube.com/watch?v=iiEt0wrFeyA&list=RDwauk7RGyB9k&index=12";

const SFLogo = () => (
  <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8 shrink-0" aria-hidden>
    <rect width="36" height="36" rx="9" fill="url(#sfg)" />
    <path d="M10 13h10l-4 5h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 23h6" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="sfg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .sf-header {
          font-family: 'Syne', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }
        .sf-header.scrolled {
          background: rgba(6, 8, 18, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sf-logo-text {
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sf-logo-icon {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }
        .sf-nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          position: relative;
          transition: color 0.2s;
          padding: 0.25rem 0;
          letter-spacing: 0.01em;
        }
        .sf-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #6366f1;
          transition: width 0.25s ease;
        }
        .sf-nav-link:hover { color: rgba(255,255,255,0.9); }
        .sf-nav-link:hover::after { width: 100%; }
        .sf-nav-link.active { color: #fff; }
        .sf-nav-link.active::after { width: 100%; background: #6366f1; }

        .sf-cta {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sf-cta:hover {
          box-shadow: 0 0 30px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }

        .sf-menu-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
        }
        .sf-menu-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .sf-mobile-drawer {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(6,8,18,0.97);
          backdrop-filter: blur(24px);
          display: flex;
          flex-direction: column;
          padding: 6rem 2rem 2rem;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .sf-mobile-drawer.open {
          transform: translateX(0);
        }

        .sf-mobile-link {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.2s;
          letter-spacing: -0.02em;
        }
        .sf-mobile-link:hover, .sf-mobile-link.active { color: #fff; }

        .sf-mobile-cta {
          margin-top: 2.5rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          text-align: center;
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 0 40px rgba(99,102,241,0.3);
          transition: all 0.2s;
        }
        .sf-mobile-cta:hover { opacity: 0.9; }
      `}</style>

      <header className={`sf-header ${scrolled ? "scrolled" : ""}`}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="sf-logo-icon">
              <SFLogo/>
            </div>
            <span className="sf-logo-text">StreamForge</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`sf-nav-link ${pathname === l.href ? "active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="sf-cta">
              Go to App →
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="sf-menu-btn flex items-center justify-center md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`sf-mobile-drawer md:hidden ${open ? "open" : ""}`}>
        <nav className="flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`sf-mobile-link ${pathname === l.href ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="sf-mobile-cta">
          Go to App →
        </a>
        <p className="mt-auto text-xs text-white/20 font-mono text-center pt-6">
          © 2025 StreamForge
        </p>
      </div>
    </>
  );
}

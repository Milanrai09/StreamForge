import Link from "next/link";
import { Zap, Github, Twitter, Mail } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const APP_URL = "https://www.youtube.com/watch?v=iiEt0wrFeyA&list=RDwauk7RGyB9k&index=12";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .sf-footer {
          font-family: 'Syne', sans-serif;
          background: #04060f;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .sf-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
        }
        .sf-footer-logo {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sf-footer-link {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .sf-footer-link:hover { color: rgba(255,255,255,0.85); }
        .sf-footer-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.4);
          transition: all 0.2s;
        }
        .sf-footer-icon:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
          color: #a5b4fc;
        }
        .sf-footer-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .sf-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: rgba(165,180,252,0.7);
          letter-spacing: 0.05em;
        }
      `}</style>

      <footer className="sf-footer">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 0 20px rgba(99,102,241,0.35)"}}>
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="sf-footer-logo">StreamForge</span>
              </Link>
              <p className="text-sm text-white/30 leading-relaxed max-w-xs">
                Upload once. Transcode automatically. Stream everywhere — in every quality, on every device.
              </p>
              <div className="mt-4">
                <span className="sf-badge">v1.0.0 — LIVE</span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-4">
                Navigation
              </p>
              <ul className="space-y-2.5">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="sf-footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-4">
                Get Started
              </p>
              <p className="text-sm text-white/30 mb-4 leading-relaxed">
                Ready to forge your video pipeline? Launch the app and start uploading instantly.
              </p>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Open StreamForge App
                <span className="text-indigo-500">→</span>
              </a>
            </div>
          </div>

          <hr className="sf-footer-divider mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20 font-mono">
              © {new Date().getFullYear()} StreamForge. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <a href="mailto:memilanrai19@gmail.com" className="sf-footer-icon" aria-label="Email">
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="sf-footer-icon" aria-label="GitHub">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="sf-footer-icon" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
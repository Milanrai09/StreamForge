import { Upload, Cpu, Radio, Play, Shield, Zap, Globe, Film, SlidersHorizontal, Clock, Lock, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Upload,
    title: "Universal Upload",
    desc: "Supports MP4, MOV, MKV, AVI, WebM and more. Drag-and-drop or programmatic upload via REST API.",
    tag: "Core",
  },
  {
    icon: Cpu,
    title: "Auto Transcoding",
    desc: "Every video is automatically transcoded into multiple bitrates. Our pipeline handles encoding, packaging, and manifest generation.",
    tag: "Core",
  },
  {
    icon: Radio,
    title: "HLS Adaptive Streaming",
    desc: "Output in HLS format with master manifests and per-quality playlists. Seamlessly adapts to the viewer's bandwidth.",
    tag: "Streaming",
  },
  {
    icon: SlidersHorizontal,
    title: "Multi-Quality Output",
    desc: "Generates 1080p, 720p, 480p, and 360p streams simultaneously. Viewers always get the sharpest image their connection allows.",
    tag: "Streaming",
  },
  {
    icon: Film,
    title: "Thumbnail Generation",
    desc: "Automatic thumbnail extraction at key frames. Thumbnails are stored and served as a JSON asset collection.",
    tag: "Media",
  },
  {
    icon: Clock,
    title: "Processing Status",
    desc: "Real-time status tracking for every upload — from 'processing' to 'ready'. Webhook-ready for pipeline integrations.",
    tag: "Platform",
  },
  {
    icon: Globe,
    title: "Namespace Routing",
    desc: "Each video gets a unique namespace slug. Use it to organize uploads, build custom CDN paths, or isolate user content.",
    tag: "Platform",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "Auth0-backed authentication. Each user only sees and accesses their own video library — isolated at the database level.",
    tag: "Security",
  },
  {
    icon: BarChart3,
    title: "File Manifest",
    desc: "Full file inventory stored per video. Track every HLS segment, thumbnail, and asset in a queryable JSON manifest.",
    tag: "Data",
  },
];

const TAG_COLORS = {
  Core:      { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)",  text: "#a5b4fc" },
  Streaming: { bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.25)", text: "#d8b4fe" },
  Media:     { bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.25)",  text: "#67e8f9" },
  Platform:  { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", text: "#6ee7b7" },
  Security:  { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", text: "#fcd34d" },
  Data:      { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  text: "#fca5a5" },
};

const APP_URL = "https://www.youtube.com/watch?v=iiEt0wrFeyA&list=RDwauk7RGyB9k&index=12";

export default function FeaturesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .sf-features {
          font-family: 'Syne', sans-serif;
          background: #060810;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .sf-feat-hero {
          padding: 8rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          max-width: 700px;
          margin: 0 auto;
        }
        .sf-feat-hero-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 800; letter-spacing: -0.04em; color: #fff;
          margin-bottom: 1rem;
        }
        .sf-feat-hero-title span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sf-feat-hero-sub {
          color: rgba(255,255,255,0.35); font-size: 1rem; line-height: 1.7;
        }
        .sf-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.2rem 0.55rem; border-radius: 4px;
          font-weight: 500;
        }
        .sf-feat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          max-width: 1100px; margin: 0 auto;
        }
        @media(min-width:640px)  { .sf-feat-grid { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:1024px) { .sf-feat-grid { grid-template-columns: repeat(3,1fr); } }

        .sf-feat-card {
          background: #060810;
          padding: 2rem;
          transition: background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .sf-feat-card:hover { background: rgba(99,102,241,0.04); }
        .sf-feat-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .sf-feat-card:hover::after { opacity: 1; }

        .sf-feat-icon {
          width: 42px; height: 42px; border-radius: 11px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8;
          margin-bottom: 1rem;
          transition: all 0.25s;
        }
        .sf-feat-card:hover .sf-feat-icon {
          background: rgba(99,102,241,0.18);
          box-shadow: 0 0 20px rgba(99,102,241,0.25);
        }
        .sf-feat-title {
          font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;
        }
        .sf-feat-desc {
          font-size: 0.85rem; color: rgba(255,255,255,0.33); line-height: 1.65;
        }

        .sf-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(99,102,241,0.8); margin-bottom: 0.5rem; display: block;
        }

        .sf-cta-strip {
          max-width: 1100px; margin: 5rem auto 0; padding: 0 1.5rem 6rem;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3rem;
        }
        .sf-cta-strip h3 { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; }
        .sf-cta-strip p  { color: rgba(255,255,255,0.35); font-size: 0.9rem; margin-top: 0.25rem; }

        .sf-btn {
          font-family: 'DM Mono', monospace; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.04em; padding: 0.7rem 1.5rem; border-radius: 10px;
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1, #7c3aed); color: #fff;
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 0 30px rgba(99,102,241,0.25);
          transition: all 0.2s; white-space: nowrap;
        }
        .sf-btn:hover { box-shadow: 0 0 50px rgba(99,102,241,0.4); transform: translateY(-1px); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease both; }
      `}</style>

      <div className="sf-features">
        {/* Hero */}
        <div className="sf-feat-hero fade-up">
          <span className="sf-label">// Platform Features</span>
          <h1 className="sf-feat-hero-title">
            Everything you need to<br /><span>stream at scale.</span>
          </h1>
          <p className="sf-feat-hero-sub">
            StreamForge is built end-to-end for video — from the moment a file lands on our servers to the moment it plays in the browser.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ padding: "0 1.5rem 0" }}>
          <div className="sf-feat-grid">
            {FEATURES.map(({ icon: Icon, title, desc, tag }) => {
              const tc = TAG_COLORS[tag];
              return (
                <div className="sf-feat-card" key={title}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1rem" }}>
                    <div className="sf-feat-icon">
                      <Icon className="w-4.5 h-4.5" style={{ width:18, height:18 }} />
                    </div>
                    <span className="sf-tag" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}>
                      {tag}
                    </span>
                  </div>
                  <div className="sf-feat-title">{title}</div>
                  <p className="sf-feat-desc">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA strip */}
        <div className="sf-cta-strip">
          <div>
            <h3>See it in action.</h3>
            <p>Open the app and upload your first video — it's ready in seconds.</p>
          </div>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="sf-btn">
            <Zap className="w-4 h-4 fill-white" /> Launch StreamForge
          </a>
        </div>
      </div>
    </>
  );
}
import { Zap, Target, Code2, Heart, ArrowRight } from "lucide-react";

const APP_URL = "https://www.youtube.com/watch?v=iiEt0wrFeyA&list=RDwauk7RGyB9k&index=12";

const VALUES = [
  {
    icon: Target,
    title: "Built for simplicity",
    desc: "Video transcoding is complex engineering. StreamForge hides all that complexity behind a single upload button.",
  },
  {
    icon: Code2,
    title: "Developer-first",
    desc: "Every piece of metadata — thumbnails, HLS segments, quality levels — is queryable. Build on top of StreamForge.",
  },
  {
    icon: Heart,
    title: "Made with care",
    desc: "Crafted with attention to every detail, from the progress indicator to the quality selector. Your viewers notice.",
  },
];

const TECH = [
  "Next.js 14", "App Router", "Prisma ORM", "PostgreSQL",
  "Auth0", "HLS.js", "FFmpeg", "Tailwind CSS",
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .sf-about {
          font-family: 'Syne', sans-serif;
          background: #060810;
          color: #fff;
          min-height: 100vh;
        }

        .sf-about-hero {
          padding: 8rem 1.5rem 5rem;
          max-width: 900px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media(min-width:768px) {
          .sf-about-hero { grid-template-columns: 1fr 1fr; align-items: center; }
        }

        .sf-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(99,102,241,0.8); margin-bottom: 0.75rem; display: block;
        }

        .sf-about-title {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1.05;
          margin-bottom: 1.25rem;
        }
        .sf-about-title span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .sf-about-body {
          color: rgba(255,255,255,0.38);
          font-size: 0.95rem; line-height: 1.8;
        }
        .sf-about-body + .sf-about-body { margin-top: 1rem; }

        /* Decorative box */
        .sf-about-deco {
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.06));
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 20px;
          padding: 2.5rem;
          position: relative; overflow: hidden;
        }
        .sf-about-deco::before {
          content: '';
          position: absolute; top:-60px; right:-60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
        }
        .sf-deco-num {
          font-size: 4rem; font-weight: 800; letter-spacing: -0.05em;
          background: linear-gradient(135deg, #fff, #a5b4fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1; margin-bottom: 0.5rem;
        }
        .sf-deco-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .sf-deco-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 1.25rem 0; }

        /* Values */
        .sf-values {
          max-width: 900px; margin: 0 auto; padding: 0 1.5rem 5rem;
          display: grid; grid-template-columns: 1fr; gap: 1rem;
        }
        @media(min-width:640px) { .sf-values { grid-template-columns: repeat(3,1fr); } }

        .sf-val-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 1.75rem;
          transition: border-color 0.3s, transform 0.3s;
        }
        .sf-val-card:hover { border-color: rgba(99,102,241,0.25); transform: translateY(-3px); }
        .sf-val-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8; margin-bottom: 1rem;
        }
        .sf-val-title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; }
        .sf-val-desc  { font-size: 0.83rem; color: rgba(255,255,255,0.33); line-height: 1.65; }

        /* Tech stack */
        .sf-tech {
          max-width: 900px; margin: 0 auto; padding: 0 1.5rem 5rem;
          border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4rem;
        }
        .sf-tech-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; }
        .sf-tech-chips {
          display: flex; flex-wrap: wrap; gap: 0.6rem;
        }
        .sf-chip {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem; padding: 0.35rem 0.8rem;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          transition: all 0.2s;
        }
        .sf-chip:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.2); color: #a5b4fc; }

        /* CTA */
        .sf-about-cta {
          max-width: 900px; margin: 0 auto; padding: 0 1.5rem 7rem;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3.5rem;
        }

        .sf-btn {
          font-family: 'DM Mono', monospace; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.04em; padding: 0.7rem 1.4rem; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #7c3aed); color: #fff;
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 0 30px rgba(99,102,241,0.25);
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: all 0.2s; white-space: nowrap;
        }
        .sf-btn:hover { box-shadow: 0 0 50px rgba(99,102,241,0.4); transform: translateY(-1px); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease both; }
      `}</style>

      <div className="sf-about">
        {/* Hero grid */}
        <div className="sf-about-hero fade-up">
          <div>
            <span className="sf-label">// About StreamForge</span>
            <h1 className="sf-about-title">
              Video infrastructure,<br /><span>without the headache.</span>
            </h1>
            <p className="sf-about-body">
              StreamForge was built to solve a real problem: setting up a video transcoding pipeline is painful, expensive, and time-consuming. Cloud encoding services are either too expensive, too opaque, or require a PhD in FFmpeg configuration.
            </p>
            <p className="sf-about-body" style={{ marginTop:"1rem" }}>
              So we built StreamForge — an end-to-end platform that takes any video you throw at it and turns it into a streamable, multi-quality HLS asset in under a minute. You upload, we transcode, everyone streams.
            </p>
          </div>

          <div className="sf-about-deco">
            <div className="sf-deco-num">4</div>
            <div className="sf-deco-label">HLS quality levels per video</div>
            <hr className="sf-deco-divider" />
            <div className="sf-deco-num" style={{ fontSize:"2.4rem" }}>1080p</div>
            <div className="sf-deco-label">Max output resolution</div>
            <hr className="sf-deco-divider" />
            <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.25)", fontFamily:"'DM Mono',monospace", lineHeight:1.6 }}>
              From upload to stream-ready.<br />Automatic. Every time.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 1.5rem 2rem" }}>
          <span className="sf-label">// Our principles</span>
        </div>
        <div className="sf-values">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div className="sf-val-card" key={title}>
              <div className="sf-val-icon"><Icon style={{width:18,height:18}} /></div>
              <div className="sf-val-title">{title}</div>
              <p className="sf-val-desc">{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="sf-tech">
          <span className="sf-label">// Built with</span>
          <div className="sf-tech-title">Technology Stack</div>
          <div className="sf-tech-chips">
            {TECH.map((t) => <span className="sf-chip" key={t}>{t}</span>)}
          </div>
        </div>

        {/* CTA */}
        <div className="sf-about-cta">
          <div>
            <h3 style={{ fontSize:"1.3rem", fontWeight:700, letterSpacing:"-0.02em" }}>Want to try it?</h3>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.875rem", marginTop:"0.25rem" }}>
              Launch the app and upload your first video free.
            </p>
          </div>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="sf-btn">
            Open StreamForge <ArrowRight style={{width:16,height:16}} />
          </a>
        </div>
      </div>
    </>
  );
}
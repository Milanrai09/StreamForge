import { Mail, MessageCircle, Zap, ExternalLink, Bug, HelpCircle, Lightbulb } from "lucide-react";

const EMAIL = "memilanrai19@gmail.com";

const TOPICS = [
  {
    icon: Bug,
    label: "Bug Report",
    subject: "Bug Report — StreamForge",
    body: "Hi,\n\nI found a bug in StreamForge:\n\n[Describe the issue]\n\nSteps to reproduce:\n1. \n2. \n\nExpected behavior:\nActual behavior:\n",
    color: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: "rgba(252,165,165,0.8)", badge: "rgba(239,68,68,0.1)", badgeText: "#fca5a5", badgeBorder: "rgba(239,68,68,0.25)" },
  },
  {
    icon: HelpCircle,
    label: "Support",
    subject: "Support Request — StreamForge",
    body: "Hi,\n\nI need help with StreamForge:\n\n[Describe your question or issue]\n\nDetails:\n",
    color: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", icon: "rgba(165,180,252,0.8)", badge: "rgba(99,102,241,0.1)", badgeText: "#a5b4fc", badgeBorder: "rgba(99,102,241,0.25)" },
  },
  {
    icon: Lightbulb,
    label: "Feature Request",
    subject: "Feature Request — StreamForge",
    body: "Hi,\n\nI have an idea for StreamForge:\n\n[Describe the feature]\n\nWhy it would be useful:\n",
    color: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: "rgba(253,230,138,0.8)", badge: "rgba(245,158,11,0.1)", badgeText: "#fcd34d", badgeBorder: "rgba(245,158,11,0.25)" },
  },
];

function buildMailto(subject, body) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .sf-contact {
          font-family: 'Syne', sans-serif;
          background: #060810;
          color: #fff;
          min-height: 100vh;
        }

        .sf-contact-hero {
          max-width: 700px; margin: 0 auto;
          padding: 8rem 1.5rem 4rem;
          text-align: center;
        }

        .sf-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(99,102,241,0.8); margin-bottom: 0.75rem; display: block;
        }

        .sf-contact-title {
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1.05;
          margin-bottom: 1rem;
        }
        .sf-contact-title span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .sf-contact-sub {
          color: rgba(255,255,255,0.35); font-size: 1rem; line-height: 1.7;
          max-width: 480px; margin: 0 auto;
        }

        /* Email card */
        .sf-email-card {
          max-width: 540px; margin: 3rem auto 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(124,58,237,0.06));
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px; padding: 2.5rem;
          text-align: center; position: relative; overflow: hidden;
        }
        .sf-email-card::before {
          content: '';
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
        }
        .sf-email-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8; margin: 0 auto 1.25rem;
          position: relative;
          box-shadow: 0 0 30px rgba(99,102,241,0.2);
        }
        .sf-email-label {
          font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;
        }
        .sf-email-address {
          font-family: 'DM Mono', monospace;
          font-size: 1.05rem; font-weight: 500; color: #fff; letter-spacing: 0.01em;
          margin-bottom: 1.5rem; position: relative;
        }
        .sf-open-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem; font-weight: 500; letter-spacing: 0.04em;
          padding: 0.7rem 1.5rem; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #7c3aed); color: #fff;
          border: 1px solid rgba(139,92,246,0.4);
          box-shadow: 0 0 30px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: all 0.2s; position: relative;
        }
        .sf-open-btn:hover {
          box-shadow: 0 0 50px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .sf-email-note {
          font-size: 0.75rem; color: rgba(255,255,255,0.2); margin-top: 1rem;
          font-family: 'DM Mono', monospace;
        }

        /* Topic cards */
        .sf-topics {
          max-width: 900px; margin: 5rem auto 0; padding: 0 1.5rem;
        }
        .sf-topics-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .sf-topics-grid {
          display: grid; grid-template-columns: 1fr; gap: 1rem;
        }
        @media(min-width:640px) { .sf-topics-grid { grid-template-columns: repeat(3,1fr); } }

        .sf-topic-card {
          border-radius: 14px; padding: 1.75rem;
          border: 1px solid;
          transition: transform 0.25s, box-shadow 0.25s;
          display: flex; flex-direction: column; gap: 0.75rem;
          text-decoration: none; cursor: pointer;
        }
        .sf-topic-card:hover { transform: translateY(-3px); }

        .sf-topic-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid;
        }
        .sf-topic-label { font-size: 0.95rem; font-weight: 700; color: #fff; }
        .sf-topic-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.2rem 0.55rem; border-radius: 4px;
          display: inline-flex; align-items: center; gap: 0.3rem;
          border: 1px solid; width: fit-content;
        }
        .sf-topic-cta {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; gap: 0.3rem;
          margin-top: auto;
        }

        /* FAQ */
        .sf-faq {
          max-width: 900px; margin: 5rem auto 0; padding: 0 1.5rem 7rem;
          border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4rem;
        }
        .sf-faq-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; }
        .sf-faq-item { padding: 1.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .sf-faq-q { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
        .sf-faq-a { font-size: 0.85rem; color: rgba(255,255,255,0.35); line-height: 1.65; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease both; }
      `}</style>

      <div className="sf-contact">
        {/* Hero */}
        <div className="sf-contact-hero fade-up">
          <span className="sf-label">// Contact</span>
          <h1 className="sf-contact-title">
            Questions?<br /><span>Let's talk.</span>
          </h1>
          <p className="sf-contact-sub">
            Got a bug, a question, or an idea? Drop me an email and I'll get back to you as soon as possible.
          </p>

          {/* Main email card */}
          <div className="sf-email-card">
            <div className="sf-email-icon">
              <Mail style={{ width:24, height:24 }} />
            </div>
            <div className="sf-email-label">Reach me directly at</div>
            <div className="sf-email-address">{EMAIL}</div>
            <a href={`mailto:${EMAIL}`} className="sf-open-btn">
              <Mail style={{ width:14, height:14 }} />
              Open Email Client
              <ExternalLink style={{ width:12, height:12, opacity:0.6 }} />
            </a>
            <p className="sf-email-note">Opens your default mail app with my address pre-filled.</p>
          </div>
        </div>

        {/* Topic cards */}
        <div className="sf-topics">
          <span className="sf-label">// Get in touch about</span>
          <div className="sf-topics-title">Pick a topic — we'll pre-fill the email for you</div>
          <div className="sf-topics-grid">
            {TOPICS.map(({ icon: Icon, label, subject, body, color }) => (
              <a
                key={label}
                href={buildMailto(subject, body)}
                className="sf-topic-card"
                style={{ background: color.bg, borderColor: color.border }}
              >
                <div
                  className="sf-topic-icon"
                  style={{ background: `${color.bg}`, borderColor: color.border, color: color.icon }}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </div>
                <div className="sf-topic-label">{label}</div>
                <span
                  className="sf-topic-badge"
                  style={{ background: color.badge, color: color.badgeText, borderColor: color.badgeBorder }}
                >
                  {label}
                </span>
                <div className="sf-topic-cta">
                  Send email <ExternalLink style={{ width:11, height:11 }} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="sf-faq">
          <span className="sf-label">// Common questions</span>
          <div className="sf-faq-title">Before you write</div>

          {[
            {
              q: "How long does video processing take?",
              a: "Most videos are fully transcoded and stream-ready in under 60 seconds, depending on file size and original resolution.",
            },
            {
              q: "What video formats are supported?",
              a: "StreamForge accepts MP4, MOV, MKV, AVI, WebM, and most other common container formats.",
            },
            {
              q: "What HLS quality levels will my video be encoded at?",
              a: "StreamForge generates 1080p, 720p, 480p, and 360p streams along with a master HLS playlist for adaptive bitrate playback.",
            },
            {
              q: "I uploaded a video but the status is stuck on 'processing' — what should I do?",
              a: "Wait a minute and refresh. If it still hasn't changed, send me an email with your video namespace and I'll look into it.",
            },
          ].map(({ q, a }) => (
            <div className="sf-faq-item" key={q}>
              <div className="sf-faq-q">{q}</div>
              <p className="sf-faq-a">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
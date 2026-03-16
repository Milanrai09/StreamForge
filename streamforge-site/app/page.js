import Link from "next/link";
import { Zap, Play, Upload, Cpu, Radio, ArrowRight } from "lucide-react";

const APP_URL = "https://stream-forge-chi.vercel.app/";

const STATS = [
  { value: "4K→360p", label: "Auto Transcoding" },
  { value: "HLS",     label: "Adaptive Streaming" },
  { value: "< 60s",   label: "Processing Time" },
  { value: "∞",       label: "Storage Scale" },
];

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload",
    desc: "Drop any video file — MP4, MOV, AVI, MKV. We handle it all.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Transcode",
    desc: "Our pipeline converts your video into multiple HLS quality streams automatically.",
  },
  {
    step: "03",
    icon: Radio,
    title: "Stream",
    desc: "Watch and share. Adaptive bitrate picks the best quality for every viewer.",
  },
];

export default function HomePage() {
  return (
    <div className="font-['Syne',sans-serif] bg-[#060810] text-white overflow-x-hidden min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">

        {/* Grid bg — inline style only for mask-image which has no Tailwind equivalent */}
        <div
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-size-[60px_60px]"
          style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)" }}
        />

        {/* Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-125 h-125 rounded-full bg-indigo-500/18 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-[5%] w-75 h-75 rounded-full bg-purple-500/12 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-215 flex flex-col items-center">

          {/* Eyebrow */}
          <div className="font-['DM_Mono',monospace] animate-[fadeUp_0.6s_ease_both] inline-flex items-center gap-2 text-[0.72rem] tracking-[0.15em] uppercase text-indigo-300/70 bg-indigo-500/8 border border-indigo-500/20 rounded-full px-4 py-[0.35rem] mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Video Transcoding &amp; Streaming Platform
          </div>

          {/* Title — tall, not squeezed */}
          <h1 className="animate-[fadeUp_0.6s_0.1s_ease_both] font-extrabold tracking-[-0.04em] w-full mb-8">
            <span className="block text-white text-[clamp(3.4rem,9vw,7.5rem)] leading-[1.15]">
              Forge Your
            </span>
            <span className="block text-[clamp(3.4rem,9vw,7.5rem)] leading-[1.18] bg-linear-to-br from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Video Pipeline.
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-[fadeUp_0.6s_0.18s_ease_both] text-[1.125rem] text-white/40 max-w-130 leading-[1.9] mb-12">
            Upload any video. StreamForge transcodes it into adaptive HLS streams — 1080p
            down to 360p — and delivers it to every viewer at the perfect quality.
          </p>

          {/* Buttons */}
          <div className="animate-[fadeUp_0.6s_0.26s_ease_both] flex gap-4 justify-center flex-wrap mb-20">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-['DM_Mono',monospace] inline-flex items-center gap-2 text-[0.82rem] font-medium tracking-[0.04em] px-7 py-3 rounded-[10px] text-white bg-linear-to-br from-indigo-500 to-violet-700 border border-violet-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              <Zap className="w-4 h-4 fill-white" />
              Launch App
            </a>
            <Link
              href="/features"
              className="font-['DM_Mono',monospace] inline-flex items-center gap-2 text-[0.82rem] font-medium tracking-[0.04em] px-7 py-3 rounded-[10px] text-white/70 border border-white/10 bg-white/4 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/18 hover:text-white"
            >
              <Play className="w-4 h-4" />
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-[fadeUp_0.6s_0.34s_ease_both] w-full grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden border border-white/5 divide-x divide-y sm:divide-y-0 divide-white/5">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#060810] px-4 py-7 text-center">
                <div className="bg-linear-to-br from-white to-indigo-300 bg-clip-text text-transparent text-[1.65rem] font-extrabold tracking-[-0.03em] leading-[1.3] mb-1">
                  {s.value}
                </div>
                <div className="font-['DM_Mono',monospace] text-[0.68rem] tracking-widest uppercase text-white/25">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-275 mx-auto px-6 py-24">
        <div className="max-w-130 mb-14">
          <p className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.15em] uppercase text-indigo-400/80 mb-4">
            // How it works
          </p>
          <h2 className="font-extrabold tracking-[-0.03em] leading-[1.18] text-[clamp(1.8rem,3.5vw,2.9rem)] text-white mb-5">
            Three steps.<br />Infinite streams.
          </h2>
          <p className="text-white/35 text-[1rem] leading-[1.9] max-w-120">
            From raw upload to adaptive HLS delivery — StreamForge handles everything
            in between so you don't have to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ step, icon: Icon, title, desc }) => (
            <div
              key={step}
              className="group relative bg-white/2 border border-white/6 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:border-indigo-500/25 hover:-translate-y-1"
            >
              {/* Top edge glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="font-['DM_Mono',monospace] text-[0.7rem] text-indigo-500/50 tracking-widest mb-5">
                {step}
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-[1.15rem] leading-normal text-white mb-3">
                {title}
              </div>
              <p className="text-[0.875rem] text-white/35 leading-[1.85]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="max-w-275 mx-auto px-6 pb-24">
        <div className="relative text-center rounded-3xl px-8 py-16 overflow-hidden bg-linear-to-br from-indigo-500/12 to-violet-700/8 border border-indigo-500/20">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-75 h-75 rounded-full bg-indigo-500/15 blur-[60px] pointer-events-none" />

          <h2 className="relative font-extrabold tracking-[-0.03em] leading-[1.2] text-[clamp(1.6rem,3vw,2.5rem)] text-white mb-4">
            Ready to start streaming?
          </h2>
          <p className="relative text-white/35 text-[0.95rem] leading-[1.85] mb-10">
            Upload your first video today. No setup required.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-['DM_Mono',monospace] relative inline-flex items-center gap-2 text-[0.82rem] font-medium tracking-[0.04em] px-7 py-3 rounded-[10px] text-white bg-linear-to-br from-indigo-500 to-violet-700 border border-violet-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]"
          >
            Open StreamForge
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
}
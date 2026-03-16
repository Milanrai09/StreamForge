import Link from "next/link";
import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import {
  Rocket,
  ExternalLink,
  Calendar,
  Package,
  CheckCircle2,
  ArrowRight,
  Clock,
  Globe,
  Layers,
  Play,
  Film,
  TrendingUp,
  Zap,
} from "lucide-react";
import VideoSearch from "../features/search/debounceSearch";

// ─── DATA ────────────────────────────────────────────────────────────────────

async function getLatestVideo() {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;
  if (!userId) notFound();

  const video = await prisma.video.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.video.count({ where: { userId } });

  return { video, total };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, s] of Object.entries(intervals)) {
    const n = Math.floor(seconds / s);
    if (n >= 1) return `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    processing: {
      label: "Processing",
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
      dot: "bg-amber-400 animate-pulse",
    },
    ready: {
      label: "Ready",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
      dot: "bg-emerald-400",
    },
    failed: {
      label: "Failed",
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
      dot: "bg-red-400",
    },
  };

  const s = map[status] ?? map.processing;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── HLS QUALITY PILLS ────────────────────────────────────────────────────────

function QualityPills({ video }) {
  const qualities = [
    { key: "hls1080p", label: "1080p" },
    { key: "hls720p", label: "720p" },
    { key: "hls480p", label: "480p" },
    { key: "hls360p", label: "360p" },
  ];

  const available = qualities.filter((q) => video[q.key]);

  if (available.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {available.map((q) => (
        <span
          key={q.key}
          className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
        >
          {q.label}
        </span>
      ))}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.07] p-5 group hover:border-white/[0.12] transition-all duration-300">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${accent}`}
        style={{
          background:
            "radial-gradient(circle at 0% 0%, currentColor 0%, transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
            {label}
          </span>
          <Icon className="w-4 h-4 text-white/20" />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { video, total } = await getLatestVideo();

  const hlsCount = video
    ? ["hls1080p", "hls720p", "hls480p", "hls360p"].filter((k) => video[k])
        .length
    : 0;

  return (
    <>
      <div className="home-root noise-bg min-h-screen">
        <div className="content max-w-4xl mx-auto px-6 py-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <div>
              <div className="mono text-xs text-indigo-400/70 tracking-widest uppercase mb-1">
                Video Dashboard
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Overview
              </h1>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Upload Video
            </Link>
          </header>

          {/* Search */}
          <div className="mb-8">
            <VideoSearch />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatCard
              icon={Film}
              label="Total Videos"
              value={total}
              accent="text-indigo-500/5"
            />

            <StatCard
              icon={Zap}
              label="Latest Status"
              value={video?.status ?? "—"}
              accent="text-purple-500/5"
            />

            <StatCard
              icon={Layers}
              label="HLS Qualities"
              value={hlsCount > 0 ? `${hlsCount} streams` : "—"}
              accent="text-sky-500/5"
            />
          </div>

          {/* Latest Video */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
                Latest Upload
              </h2>

              <Link
                href="/videos"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                All videos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {video ? (
              <div className="latest-card rounded-2xl p-6">
                <Link href={`/video/${video.id}`} className="flex gap-5">
                  {/* Thumbnail */}
                  <div className="thumbnail-placeholder flex-shrink-0 w-36 h-24 rounded-xl overflow-hidden relative flex items-center justify-center">
                    {video.thumbnails?.[0] ? (
                      <img
                        src={video.thumbnails[0]}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-8 h-8 text-white/10" />
                    )}

                    <span className="play-btn absolute inset-0 m-auto w-9 h-9 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-bold text-white text-lg truncate">
                        {video.title}
                      </h3>

                      <StatusBadge status={video.status} />
                    </div>

                    {video.description && (
                      <p className="text-sm text-white/40 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/30 mono mb-3">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {timeAgo(video.createdAt)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(video.createdAt)}
                      </span>

                      {video.totalFiles != null && (
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          {video.totalFiles} files
                        </span>
                      )}

                      {video.processingCompletedAt && (
                        <span className="flex items-center gap-1.5 text-emerald-400/60">
                          <CheckCircle2 className="w-3 h-3" />
                          Processed{" "}
                          {timeAgo(video.processingCompletedAt)}
                        </span>
                      )}
                    </div>

                    <QualityPills video={video} />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="latest-card rounded-2xl p-10 flex flex-col items-center text-center">
                <Film className="w-10 h-10 text-indigo-400 mb-4" />

                <p className="font-semibold text-white mb-1">
                  No videos yet
                </p>

                <p className="text-sm text-white/35 mb-5 max-w-xs">
                  Upload your first video and we'll transcode it into multiple
                  HLS streams automatically.
                </p>

                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
                >
                  <Rocket className="w-4 h-4" />
                  Upload your first video
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

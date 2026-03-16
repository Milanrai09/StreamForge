import Link from "next/link";
import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Video,
  Globe,
  PlayCircle,
  FileVideo,
  CheckCircle,
  Loader2,
  Film,
  Image as ImageIcon
} from "lucide-react";
import { CopyButton } from "./CopyButton";

async function getVideoForCurrentUser(videoId) {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;

  if (!userId) notFound();

  const video = await prisma.video.findFirst({
    where: {
      id: videoId,
      userId,
    },
  });

  if (!video) {
    notFound();
  }

  return video;
}

function VideoPlayer({ video }) {
  // Determine which video source to use (prefer HLS master playlist)
  const getVideoSource = () => {
    if (video.hlsMaster) return video.hlsMaster;
    if (video.hls1080p) return video.hls1080p;
    if (video.hls720p) return video.hls720p;
    if (video.hls480p) return video.hls480p;
    if (video.hls360p) return video.hls360p;
    return null;
  };

  const videoSource = getVideoSource();
  const isHLS = videoSource?.includes('.m3u8');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-50 rounded-lg">
          <PlayCircle className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Video Player</h2>
      </div>

      {videoSource ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          {isHLS ? (
            <video
              controls
              className="w-full h-full"
              controlsList="nodownload"
              preload="metadata"
            >
              <source src={videoSource} type="application/x-mpegURL" />
              {/* Fallback to other qualities */}
              {video.hls720p && <source src={video.hls720p} type="application/x-mpegURL" />}
              {video.hls480p && <source src={video.hls480p} type="application/x-mpegURL" />}
              Your browser does not support HLS video playback.
            </video>
          ) : (
            <video
              controls
              className="w-full h-full"
              controlsList="nodownload"
              preload="metadata"
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Video is still processing</p>
            <p className="text-sm text-gray-500 mt-1">Check back in a few minutes</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const isCompleted = status === "completed";
  const isProcessing = status === "processing";

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
      isCompleted 
        ? "bg-green-100 text-green-700" 
        : isProcessing 
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}>
      {isCompleted && <CheckCircle className="w-4 h-4" />}
      {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
      <span className="capitalize">{status}</span>
    </div>
  );
}

function ThumbnailGallery({ video }) {
  const getThumbnails = () => {
    if (!video.thumbnails) return [];
    
    try {
      const thumbs = Array.isArray(video.thumbnails) 
        ? video.thumbnails 
        : JSON.parse(JSON.stringify(video.thumbnails));
      
      if (Array.isArray(thumbs)) {
        return thumbs.map(t => typeof t === 'string' ? t : t?.url || t?.path).filter(Boolean);
      }
      
      if (typeof video.thumbnails === 'string') {
        return [video.thumbnails];
      }
      
      return [];
    } catch (e) {
      return [];
    }
  };

  const thumbnails = getThumbnails();

  if (thumbnails.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-50 rounded-lg">
          <ImageIcon className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Thumbnails</h2>
        <span className="text-sm text-gray-500">({thumbnails.length})</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {thumbnails.map((thumb, idx) => (
          <a 
            key={idx}
            href={thumb}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
          >
            <img 
              src={thumb} 
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
}

function StreamLink({ label, url, quality }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="shrink-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          {label}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 ml-2">
          {quality}
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-sm text-blue-600 hover:text-blue-700 font-mono break-all"
      >
        {url}
      </a>
      <div className="flex items-center gap-2 shrink-0">
        <CopyButton text={url} />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </a>
      </div>
    </div>
  );
}

export default async function VideoDetailPage({ params }) {
  const video = await getVideoForCurrentUser(params.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Videos</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Title Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {video.title}
            </h1>
            <StatusBadge status={video.status} />
          </div>

          {video.description && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Video Player */}
        <VideoPlayer video={video} />

        {/* Thumbnails */}
        <ThumbnailGallery video={video} />

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Created Date */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Uploaded
              </h2>
            </div>

            <p className="text-xl font-semibold text-gray-900">
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(video.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Processing Completed */}
          {video.processingCompletedAt && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Processing Completed
                </h2>
              </div>

              <p className="text-xl font-semibold text-gray-900">
                {new Date(video.processingCompletedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(video.processingCompletedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* Video ID */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileVideo className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Video ID
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-gray-900 break-all flex-1">
                {video.id}
              </p>
              <CopyButton text={video.id} />
            </div>
          </div>

          {/* Namespace */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Film className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Namespace
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-gray-900 break-all flex-1">
                {video.namespace}
              </p>
              <CopyButton text={video.namespace} />
            </div>
          </div>
        </div>

        {/* HLS Streams */}
        {(video.hlsMaster || video.hls1080p || video.hls720p || video.hls480p || video.hls360p) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">HLS Streams</h2>
            </div>

            <div className="space-y-3">
              {video.hlsMaster && (
                <StreamLink label="Master Playlist" url={video.hlsMaster} quality="Adaptive" />
              )}
              {video.hls1080p && (
                <StreamLink label="1080p" url={video.hls1080p} quality="High" />
              )}
              {video.hls720p && (
                <StreamLink label="720p" url={video.hls720p} quality="Medium" />
              )}
              {video.hls480p && (
                <StreamLink label="480p" url={video.hls480p} quality="Standard" />
              )}
              {video.hls360p && (
                <StreamLink label="360p" url={video.hls360p} quality="Low" />
              )}
            </div>
          </div>
        )}

        {/* File Information */}
        {video.totalFiles && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FileVideo className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Processing Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Files Generated</p>
                <p className="text-2xl font-bold text-gray-900">{video.totalFiles}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

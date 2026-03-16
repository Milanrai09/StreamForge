import Link from "next/link";
import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { 
  Video,
  Calendar,
  Layers,
  PlayCircle,
  Clock,
  Loader2
} from "lucide-react";

async function getUserVideos() {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;

  if (!userId) notFound();

  // Get ALL videos without filtering by status
  const videos = await prisma.video.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  return videos;
}

function VideoCard({ video }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Extract first thumbnail from JSON array
  const getThumbnail = () => {
    if (!video.thumbnails) return null;
    
    try {
      // Handle if thumbnails is already an array
      const thumbs = Array.isArray(video.thumbnails) 
        ? video.thumbnails 
        : JSON.parse(JSON.stringify(video.thumbnails));
      
      if (Array.isArray(thumbs) && thumbs.length > 0) {
        // Return first thumbnail URL
        return typeof thumbs[0] === 'string' ? thumbs[0] : thumbs[0]?.url || thumbs[0]?.path;
      }
      
      // Handle if thumbnails is a single URL string
      if (typeof video.thumbnails === 'string') {
        return video.thumbnails;
      }
      
      return null;
    } catch (e) {
      console.error("Error parsing thumbnail:", e);
      return null;
    }
  };

  const thumbnail = getThumbnail();
  const isProcessing = video.status !== "completed";

  return (
    <Link href={`/video/${video.id}`}>
      <div className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer">

        {/* Thumbnail */}
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 relative">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="h-40 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
              <Video className="w-12 h-12 text-blue-300" />
            </div>
          )}
          
          {/* Processing badge */}
          {isProcessing && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{timeAgo(video.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-4 h-4" />
            Watch →
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          Status: <span className={`font-semibold ${isProcessing ? 'text-yellow-600' : 'text-green-600'}`}>
            {video.status}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-full p-6 mb-6">
        <Video className="w-16 h-16 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        No videos yet
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-8">
        Upload your first video and manage all your content in one place.
      </p>

      <Link
        href="/upload"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        <Video className="w-5 h-5" />
        Upload Video
      </Link>
    </div>
  );
}

export default async function VideosPage() {
  const videos = await getUserVideos();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Videos
              </h1>
              <p className="text-gray-600">
                Manage and monitor all your uploaded videos
              </p>
            </div>

            {videos.length > 0 && (
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Video className="w-4 h-4" />
                Upload New
              </Link>
            )}
          </div>

          {/* Stats */}
          {videos.length > 0 && (
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {videos.length}
                  </span>{" "}
                  total video{videos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!videos.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


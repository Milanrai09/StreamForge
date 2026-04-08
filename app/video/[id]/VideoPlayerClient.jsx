"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Expand,
  Loader2,
  Pause,
  Play,
  PlayCircle,
  Volume2,
  VolumeX,
} from "lucide-react";

function buildSources(video) {
  const sources = [];

  if (video.hlsMaster) {
    sources.push({ key: "auto", label: "Auto", url: video.hlsMaster });
  }
  if (video.hls1080p) {
    sources.push({ key: "1080p", label: "1080p", url: video.hls1080p });
  }
  if (video.hls720p) {
    sources.push({ key: "720p", label: "720p", url: video.hls720p });
  }
  if (video.hls480p) {
    sources.push({ key: "480p", label: "480p", url: video.hls480p });
  }
  if (video.hls360p) {
    sources.push({ key: "360p", label: "360p", url: video.hls360p });
  }

  return sources;
}

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return "0:00";

  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export function VideoPlayerClient({ video }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const sources = useMemo(() => buildSources(video), [video]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const activeQuality = selectedQuality ?? sources[0]?.key ?? null;
  const currentSource = useMemo(
    () => sources.find((source) => source.key === activeQuality) ?? sources[0] ?? null,
    [activeQuality, sources]
  );

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(element.duration) ? element.duration : 0);
      setCurrentTime(element.currentTime || 0);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(element.currentTime || 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(element.volume);
      setIsMuted(element.muted || element.volume === 0);
    };

    element.addEventListener("loadedmetadata", handleLoadedMetadata);
    element.addEventListener("timeupdate", handleTimeUpdate);
    element.addEventListener("play", handlePlay);
    element.addEventListener("pause", handlePause);
    element.addEventListener("volumechange", handleVolumeChange);

    handleLoadedMetadata();
    handleVolumeChange();

    return () => {
      element.removeEventListener("loadedmetadata", handleLoadedMetadata);
      element.removeEventListener("timeupdate", handleTimeUpdate);
      element.removeEventListener("play", handlePlay);
      element.removeEventListener("pause", handlePause);
      element.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !currentSource) return;

    const previousTime = element.currentTime || 0;
    const shouldResume = !element.paused;

    element.src = currentSource.url;
    element.load();

    const restorePlayback = () => {
      if (previousTime > 0) {
        element.currentTime = previousTime;
      }
      if (shouldResume) {
        element.play().catch(() => {});
      }
    };

    element.addEventListener("loadedmetadata", restorePlayback, { once: true });

    return () => {
      element.removeEventListener("loadedmetadata", restorePlayback);
    };
  }, [currentSource]);

  if (!currentSource) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <PlayCircle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Video Player</h2>
        </div>

        <div className="aspect-video rounded-lg bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Video is still processing</p>
            <p className="text-sm text-gray-500 mt-1">Check back in a few minutes</p>
          </div>
        </div>
      </div>
    );
  }

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element) return;

    if (element.paused) {
      element.play().catch(() => {});
      return;
    }

    element.pause();
  };

  const handleSeek = (event) => {
    const element = videoRef.current;
    if (!element) return;

    const nextTime = Number(event.target.value);
    element.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeInput = (event) => {
    const element = videoRef.current;
    if (!element) return;

    const nextVolume = Number(event.target.value);
    element.volume = nextVolume;
    element.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const toggleMute = () => {
    const element = videoRef.current;
    if (!element) return;

    if (element.muted || element.volume === 0) {
      element.muted = false;
      if (element.volume === 0) {
        element.volume = 0.5;
      }
      return;
    }

    element.muted = true;
  };

  const enterFullscreen = async () => {
    const element = playerRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }

    if (element.requestFullscreen) {
      await element.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-50 rounded-lg">
          <PlayCircle className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Video Player</h2>
      </div>

      <div ref={playerRef} className="overflow-hidden rounded-lg bg-black">
        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            className="h-full w-full"
            preload="metadata"
            playsInline
            src={currentSource.url}
            onClick={togglePlayback}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="border-t border-white/10 bg-zinc-950 px-4 py-3 text-white">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            className="mb-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-red-500"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeInput}
                className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
              />
            </div>

            {sources.length > 1 && (
              <select
                value={activeQuality ?? ""}
                onChange={(event) => setSelectedQuality(event.target.value)}
                className="h-10 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white outline-none transition hover:bg-white/15"
              >
                {sources.map((source) => (
                  <option key={source.key} value={source.key} className="text-gray-900">
                    {source.label}
                  </option>
                ))}
              </select>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="min-w-24 text-right text-sm tabular-nums text-white/80">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                type="button"
                onClick={enterFullscreen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Expand className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

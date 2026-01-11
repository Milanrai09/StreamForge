'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VIDEO = {
  title: 'My Processed Video',
  thumbnails: [
    'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/thumbnails/thumb_01.jpg',
    'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/thumbnails/thumb_02.jpg',
    'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/thumbnails/thumb_03.jpg',
    'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/thumbnails/thumb_04.jpg',
  ],
};

const QUALITIES = [
  {
    label: 'Auto',
    url: 'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/master.m3u8',
  },
  {
    label: '360p',
    url: 'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/360p_h264.m3u8',
  },
  {
    label: '480p',
    url: 'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/480p_h264.m3u8',
  },
  {
    label: '720p',
    url: 'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/720p_h264.m3u8',
  },
  {
    label: '1080p',
    url: 'https://streamforge-processed-video.s3.amazonaws.com/processed/video_b140aebd/1080p_h264.m3u8',
  },
];

export default function WatchVideoPage() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPercent, setHoverPercent] = useState(0);

  /* ================= INIT ================= */
  useEffect(() => {
    loadSource(QUALITIES[0].url);
    return destroyHls;
  }, []);

  /* ================= HLS HELPERS ================= */
  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const loadSource = (url, resumeTime = 0, autoplay = false) => {
    const video = videoRef.current;
    if (!video) return;

    destroyHls();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      if (resumeTime) video.currentTime = resumeTime;
      if (autoplay) video.play();
      return;
    }

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (resumeTime) video.currentTime = resumeTime;
      if (autoplay) video.play();
    });

    hlsRef.current = hls;
  };

  const switchQuality = (quality) => {
    const video = videoRef.current;
    if (!video) return;

    const time = video.currentTime;
    const wasPlaying = !video.paused;

    setCurrentQuality(quality.label);
    setShowQualityMenu(false);

    loadSource(quality.url, time, wasPlaying);
  };

  /* ================= UI HELPERS ================= */
  const formatTime = (s = 0) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    videoRef.current.currentTime = p * duration;
  };

  const handleHover = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    setHoverPercent(p);
    setHoverTime(p * duration);
  };

  const thumbIndex = Math.min(
    Math.floor(hoverPercent * VIDEO.thumbnails.length),
    VIDEO.thumbnails.length - 1
  );

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-5xl mx-auto">
      <div
          ref={containerRef}
          className="relative bg-black rounded-lg overflow-hidden group aspect-video"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* CONTROLS */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 p-4 opacity-0 group-hover:opacity-100 transition">
            {/* SEEK */}
            <div
              className="relative mb-3 cursor-pointer"
              onClick={handleSeek}
              onMouseMove={handleHover}
              onMouseLeave={() => setHoverTime(null)}
            >
              {hoverTime !== null && (
                <div
                  className="absolute bottom-6 -translate-x-1/2"
                  style={{ left: `${hoverPercent * 100}%` }}
                >
                  <img
                    src={VIDEO.thumbnails[thumbIndex]}
                    className="w-32 rounded"
                  />
                  <p className="text-xs text-white text-center">
                    {formatTime(hoverTime)}
                  </p>
                </div>
              )}
              <div className="h-1 bg-gray-600">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: duration
                      ? `${(currentTime / duration) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

            {/* BAR */}
            <div className="flex justify-between items-center text-white">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() =>
                    isPlaying
                      ? videoRef.current.pause()
                      : videoRef.current.play()
                  }
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                {/* QUALITY */}
                <div className="relative">
                  <button onClick={() => setShowQualityMenu(!showQualityMenu)}>
                    ⚙ {currentQuality}
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 bg-gray-900 rounded shadow">
                      {QUALITIES.map((q) => (
                        <button
                          key={q.label}
                          onClick={() => switchQuality(q)}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-800"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen}>⛶</button>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-white text-2xl mt-4">{VIDEO.title}</h1>
      </div>
    </div>
  );
}

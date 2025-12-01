"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HLSPlayer() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [resolutions, setResolutions] = useState([]);
  const [selectedResolution, setSelectedResolution] = useState("auto");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const hls = new Hls();
    hlsRef.current = hls;

    hls.loadSource(
      "https://streamforge-processed-video.s3.amazonaws.com/processed/video_352fb7c4/master.m3u8"
    );
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Get all available levels (resolutions)
      const levels = hls.levels.map((level) => ({
        height: level.height,
        width: level.width,
        bitrate: level.bitrate,
        levelIndex: hls.levels.indexOf(level),
      }));

      setResolutions(levels);
      console.log("Available resolutions:", levels);
    });

    hls.on(Hls.Events.LEVEL_SWITCHING, (data) => {
      const level = hls.levels[data.level];
      console.log(`Switched to ${level.height}p`);
    });

    return () => {
      hls.destroy();
    };
  }, []);

  const handleResolutionChange = (e) => {
    const value = e.target.value;
    setSelectedResolution(value);

    if (value === "auto") {
      hlsRef.current.currentLevel = -1; // Auto quality
      console.log("Auto quality enabled");
    } else {
      const levelIndex = parseInt(value);
      hlsRef.current.currentLevel = levelIndex;
      console.log(`Manual quality set to level ${levelIndex}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          controls
          width="100%"
          className="w-full"
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        />
      </div>

      {/* Resolution Selector */}
      <div className="mt-4 flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
        <label className="text-white font-semibold">Resolution:</label>
        <select
          value={selectedResolution}
          onChange={handleResolutionChange}
          className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition"
        >
          <option value="auto">Auto (Adaptive)</option>
          {resolutions.map((res) => (
            <option key={res.levelIndex} value={res.levelIndex}>
              {res.height}p ({(res.bitrate / 1000).toFixed(0)} kbps)
            </option>
          ))}
        </select>

        {/* Info Display */}
        <div className="ml-auto text-gray-300 text-sm">
          <span>
            {selectedResolution === "auto"
              ? "Auto Quality"
              : `${resolutions[selectedResolution]?.height}p`}
          </span>
        </div>
      </div>

      {/* Resolution List Info */}
      <div className="mt-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-white font-semibold mb-2">Available Qualities:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {resolutions.map((res) => (
            <div
              key={res.levelIndex}
              className="bg-gray-800 p-2 rounded text-center text-sm text-gray-300"
            >
              <div className="font-semibold">{res.height}p</div>
              <div className="text-xs">
                {(res.bitrate / 1000).toFixed(0)} kbps
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
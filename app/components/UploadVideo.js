"use client";

import { useState } from "react";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please select a file and add a title.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const res = await fetch("/api/generate-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          title,
          description,
          tags: tags.split(",").filter(t => t.trim())
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to generate upload URL: ${res.statusText}`);
      }

      const data = await res.json();
      const { uploadURL, publicUrl, videoId } = data;

      // Upload directly to S3
      const upload = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!upload.ok) {
        throw new Error("Upload to S3 failed");
      }

      setUploadedUrl(publicUrl);
      setVideoId(videoId);

      alert(`✅ Video uploaded successfully!\nVideo ID: ${videoId}`);

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Upload Video</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-3 w-80"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-3 w-80"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border p-2 mb-3 w-80"
      />

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>

      {uploadedUrl && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-semibold">Upload complete!</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View video on S3
          </a>
        </div>
      )}

      <a href="/auth/logout" className="button logout mt-6">
        Log Out
      </a>
    </div>
  );
}

export default UploadVideo;

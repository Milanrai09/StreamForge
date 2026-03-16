"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

function UploadVideo() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please select a file and add a title.");
      return;
    }
    if (!user?.sub) {
      alert("Please log in first");
      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      console.log("📤 Step 1: Generating upload URL...");

      // Step 1: Get signed S3 URL from backend
      const generateUrlRes = await fetch("/api/generate-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          title,
          description,
          userId: user.sub,
          username: user.nickname || user.name || user.email || user.sub,
        }),
      });

      if (!generateUrlRes.ok) {
        throw new Error(`Failed to generate upload URL: ${generateUrlRes.statusText}`);
      }

      const data = await generateUrlRes.json();
      const { uploadURL, publicUrl, videoId: newVideoId } = data;

      console.log("✅ Upload URL generated. Video ID:", newVideoId);
      console.log("📤 Step 2: Uploading to S3...");

      // Step 2: Upload file directly to S3 using signed URL
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload to S3 failed");
      }

      setUploadProgress(100);
      setUploadedUrl(publicUrl);
      setVideoId(newVideoId);

      console.log("✅ File uploaded to S3 successfully!");
      console.log("🎬 Video will be processed by ECS soon...");

      alert(`✅ Video uploaded successfully!\nVideo ID: ${newVideoId}\n\nYour video is now queued for processing. You'll be notified when it's ready to watch.`);

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;600;700&display=swap');
        
        :root {
          --primary: #000;
          --accent: #2563eb;
          --accent-light: #3b82f6;
          --surface: #f8f8f8;
          --border: #e5e5e5;
          --text: #000;
          --text-muted: #666;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
        }

        .upload-container {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          font-family: 'Space Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -1px;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .form-field {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
          margin-bottom: 0.6rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          border: 1px solid var(--border);
          background: white;
          color: var(--text);
          padding: 0.95rem;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
          transition: all 0.3s ease;
          border-radius: 3px;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-drop-zone {
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .file-drop-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(...);
          opacity: 0;
        }

        .file-drop-zone:hover {
          border-color: var(--accent);
          background: rgba(37, 99, 235, 0.02);
        }

        .file-drop-zone:hover::before {
          opacity: 1;
        }

        .file-input-hidden {
          display: none;
        }

        .file-drop-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
          transition: color 0.3s ease;
        }

        .file-drop-text strong {
          color: var(--accent);
          font-weight: 600;
        }

        .file-drop-zone:hover .file-drop-text {
          color: var(--text-muted);
        }

        .file-drop-zone:hover .file-drop-text strong {
          color: var(--accent);
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(37, 99, 235, 0.05);
          border-radius: 3px;
          font-size: 0.85rem;
          color: var(--text);
        }

        .file-selected-icon {
          color: var(--accent);
          font-size: 1.1rem;
        }

        .file-selected-info {
          flex: 1;
        }

        .file-selected-name {
          font-weight: 600;
          display: block;
          color: var(--text);
        }

        .file-selected-size {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .progress-container {
          margin-bottom: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 3px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          font-weight: 500;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 1rem;
          border-radius: 3px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .success-message {
          background: #efe;
          border: 1px solid #cfc;
          color: #3a3;
          padding: 1.25rem;
          border-radius: 3px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .success-message p {
          margin: 0.5rem 0;
        }

        .success-message-title {
          font-weight: 700;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .video-id-code {
          display: inline-block;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 3px;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .logout-link {
          text-align: center;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .logout-link:hover {
          color: var(--text);
        }

        .required-indicator {
          color: var(--accent);
        }
      `}</style>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="upload-container w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="header">Upload</h1>
            <p className="subtitle">Share your video with the world</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Success Message */}
          {uploadedUrl && (
            <div className="success-message">
              <div className="success-message-title">✓ Upload Complete</div>
              <p>Your video has been successfully uploaded and is now processing.</p>
              <p>
                Video ID: <span className="video-id-code">{videoId}</span>
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.75rem" }}>
                You&apos;ll be notified when your video is ready to watch.
              </p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
            {/* Title Input */}
            <div className="form-field">
              <label className="form-label">
                Title <span className="required-indicator">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Description Input */}
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* File Input */}
            <div className="form-field">
              <label className="form-label">
                Video File <span className="required-indicator">*</span>
              </label>
              <label htmlFor="file-input" className="file-drop-zone">
                <p className="file-drop-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="file-drop-text" style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>
                  MP4, WebM, MOV up to 5GB
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
              </label>
              {file && (
                <div className="file-selected">
                  <span className="file-selected-icon">✓</span>
                  <div className="file-selected-info">
                    <span className="file-selected-name">{file.name}</span>
                    <span className="file-selected-size">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="progress-text">{uploadProgress}% complete</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file || !title}
              className="submit-button"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>

            {/* Logout Link */}
            <a href="/auth/logout" className="logout-link">
              Log out
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;

"use client"

import { useState } from "react";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !title) return alert("Please select a file and add a title.");
    setUploading(true);

    const res = await fetch("/api/generate-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        title,
        description,
        tags: tags.split(","),
      }),
    });
    

    const data = await res.json();
    const { uploadURL, key, videoId } = data;
    console.log("hello world url ")
    console.log(uploadURL);

    // 2️⃣ Upload video directly to S3
    const upload = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (upload.ok) {
      const s3PublicUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      setUploadedUrl(s3PublicUrl);
      alert(`✅ Video uploaded successfully! Video ID: ${videoId}`);
    } else {
      alert("❌ Upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Upload Video</h1>

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
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
            View on S3
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadVideo;

"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors group relative"
      title="Copy to clipboard"
    >
      <Copy className={`w-4 h-4 transition-colors ${
        copied ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
      }`} />
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Copied!
        </span>
      )}
    </button>
  );
}
"use client"
import React from 'react';
import UploadVideo from "./components/UploadVideo";
import WatchVideoPage from './components/HslPlayer';


export default function Home() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      hello world 
      <UploadVideo/>
      <WatchVideoPage/>
    </div>
  );
}




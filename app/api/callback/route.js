
// ============================================================
// app/api/update-db/route.js
// Receives processed video data from processor.js
// ============================================================

import { NextResponse } from 'next/server';
import { videoStore } from '@/app/utils/video/store';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 RECEIVED PROCESSED VIDEO DATA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const {
      originalKey,
      masterPlaylists,
      thumbnails,
      playlists,
      allFiles,
      totalFiles,
      status,
      processedAt
    } = body;

    console.log('Original Key:', originalKey);
    console.log('Status:', status);
    console.log('Total Files:', totalFiles);
    console.log('Master Playlists:', masterPlaylists);
    console.log('Thumbnails Count:', thumbnails?.length || 0);
    console.log('Playlists Count:', playlists?.length || 0);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Upsert video in store
    const video = videoStore.upsert(originalKey, {
      status,
      masterPlaylistH264: masterPlaylists?.h264,
      masterPlaylistVp9: masterPlaylists?.vp9,
      thumbnails,
      playlists,
      processedFiles: allFiles,
      totalFiles,
      processedAt
    });

    console.log('✅ Video updated successfully in store');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      message: 'Video processing status updated',
      videoId: video.id,
      data: {
        id: video.id,
        originalKey: video.originalKey,
        status: video.status,
        masterPlaylists: {
          h264: video.masterPlaylistH264,
          vp9: video.masterPlaylistVp9
        },
        thumbnails: video.thumbnails,
        totalFiles: video.totalFiles,
        processedAt: video.processedAt,
        updatedAt: video.updatedAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR UPDATING DATABASE');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update database',
      message: error.message
    }, { status: 500 });
  }
}

// Optional: GET to check update-db status
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const s3Key = searchParams.get('s3Key');

  if (!s3Key) {
    return NextResponse.json({
      error: 'Missing s3Key parameter'
    }, { status: 400 });
  }

  const video = videoStore.findByKey(s3Key);

  if (!video) {
    return NextResponse.json({
      error: 'Video not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: video
  });
}



// This will reset when server restarts
let videos = [];
let idCounter = 1;

export const videoStore = {
  // CREATE
  create(videoData) {
    const video = {
      id: `video_${idCounter++}`,
      ...videoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    videos.push(video);
    
    console.log('📝 CREATE Video:');
    console.log(JSON.stringify(video, null, 2));
    
    return video;
  },

  // READ (single)
  findById(id) {
    const video = videos.find(v => v.id === id);
    
    console.log(`🔍 READ Video by ID: ${id}`);
    console.log(video ? JSON.stringify(video, null, 2) : 'Not found');
    
    return video;
  },

  // READ (by key)
  findByKey(s3Key) {
    const video = videos.find(v => v.originalKey === s3Key);
    
    console.log(`🔍 READ Video by Key: ${s3Key}`);
    console.log(video ? JSON.stringify(video, null, 2) : 'Not found');
    
    return video;
  },

  // READ (all with filters)
  findAll({ status, page = 1, limit = 10 } = {}) {
    let filtered = videos;
    
    if (status) {
      filtered = filtered.filter(v => v.status === status);
    }
    
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    console.log(`📋 READ All Videos (status: ${status || 'all'}, page: ${page})`);
    console.log(`Total: ${total}, Showing: ${paginated.length}`);
    
    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // UPDATE
  update(id, updates) {
    const index = videos.findIndex(v => v.id === id);
    
    if (index === -1) {
      console.log(`❌ UPDATE Failed: Video ${id} not found`);
      return null;
    }
    
    videos[index] = {
      ...videos[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`✏️ UPDATE Video: ${id}`);
    console.log(JSON.stringify(videos[index], null, 2));
    
    return videos[index];
  },

  // UPDATE by key
  updateByKey(s3Key, updates) {
    const index = videos.findIndex(v => v.originalKey === s3Key);
    
    if (index === -1) {
      console.log(`❌ UPDATE Failed: Video with key ${s3Key} not found`);
      return null;
    }
    
    videos[index] = {
      ...videos[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`✏️ UPDATE Video by Key: ${s3Key}`);
    console.log(JSON.stringify(videos[index], null, 2));
    
    return videos[index];
  },

  // DELETE
  delete(id) {
    const index = videos.findIndex(v => v.id === id);
    
    if (index === -1) {
      console.log(`❌ DELETE Failed: Video ${id} not found`);
      return false;
    }
    
    const deleted = videos.splice(index, 1)[0];
    
    console.log(`🗑️ DELETE Video: ${id}`);
    console.log(JSON.stringify(deleted, null, 2));
    
    return true;
  },

  // UPSERT (update or create)
  upsert(s3Key, videoData) {
    const existing = this.findByKey(s3Key);
    
    if (existing) {
      return this.updateByKey(s3Key, videoData);
    } else {
      return this.create({ originalKey: s3Key, ...videoData });
    }
  },

  // Get all data (for debugging)
  getAll() {
    console.log('📊 ALL VIDEOS IN STORE:');
    console.log(JSON.stringify(videos, null, 2));
    return videos;
  },

  // Clear all (for testing)
  clear() {
    videos = [];
    idCounter = 1;
    console.log('🧹 Store cleared');
  }
};
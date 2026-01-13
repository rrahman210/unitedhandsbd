/**
 * Facebook Graph API Client for fetching Page photos
 */

export interface FacebookPhoto {
  id: string;
  images: Array<{
    source: string;
    width: number;
    height: number;
  }>;
  name?: string;
  created_time: string;
}

export interface FacebookAlbum {
  id: string;
  name: string;
  count?: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: string;
  width: number;
  height: number;
}

interface FacebookPhotosResponse {
  data: FacebookPhoto[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface FacebookAlbumsResponse {
  data: FacebookAlbum[];
  paging?: {
    next?: string;
  };
}

const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Categorize photos based on album name or caption
 */
function categorizePhoto(albumName?: string, caption?: string): string {
  const text = `${albumName || ''} ${caption || ''}`.toLowerCase();

  if (text.includes('medical') || text.includes('health') || text.includes('doctor') || text.includes('clinic')) {
    return 'Healthcare';
  }
  if (text.includes('education') || text.includes('school') || text.includes('student') || text.includes('learning')) {
    return 'Education';
  }
  if (text.includes('food') || text.includes('distribution') || text.includes('relief') || text.includes('aid')) {
    return 'Food Distribution';
  }
  if (text.includes('legal') || text.includes('law') || text.includes('advocate') || text.includes('rights')) {
    return 'Legal Aid';
  }
  if (text.includes('event') || text.includes('celebration') || text.includes('ceremony')) {
    return 'Events';
  }
  if (text.includes('volunteer') || text.includes('team')) {
    return 'Volunteers';
  }

  return 'Community';
}

/**
 * Get the best quality image from Facebook's image array
 */
function getBestImage(images: FacebookPhoto['images']): { src: string; width: number; height: number } {
  // Sort by size (largest first) and pick the best one
  const sorted = [...images].sort((a, b) => (b.width * b.height) - (a.width * a.height));

  // Prefer images around 1200-1600px width for good quality without being too large
  const ideal = sorted.find(img => img.width >= 800 && img.width <= 1600) || sorted[0];

  return {
    src: ideal.source,
    width: ideal.width,
    height: ideal.height
  };
}

export class FacebookClient {
  private pageId: string;
  private accessToken: string;

  constructor(pageId: string, accessToken: string) {
    this.pageId = pageId;
    this.accessToken = accessToken;
  }

  /**
   * Fetch all albums from the page
   */
  async getAlbums(): Promise<FacebookAlbum[]> {
    const albums: FacebookAlbum[] = [];
    let url = `${GRAPH_API_BASE}/${this.pageId}/albums?fields=id,name,count&access_token=${this.accessToken}`;

    while (url) {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch albums: ${error}`);
      }

      const data: FacebookAlbumsResponse = await response.json();
      albums.push(...data.data);
      url = data.paging?.next || '';
    }

    return albums;
  }

  /**
   * Fetch photos from a specific album
   */
  async getAlbumPhotos(albumId: string, albumName: string, limit = 100): Promise<GalleryImage[]> {
    const photos: GalleryImage[] = [];
    let url = `${GRAPH_API_BASE}/${albumId}/photos?fields=id,images,name,created_time&limit=${limit}&access_token=${this.accessToken}`;

    while (url && photos.length < limit) {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch album photos: ${error}`);
      }

      const data: FacebookPhotosResponse = await response.json();

      for (const photo of data.data) {
        if (!photo.images?.length) continue;

        const bestImage = getBestImage(photo.images);

        photos.push({
          id: `fb_${photo.id}`,
          src: bestImage.src,
          alt: photo.name || `Photo from ${albumName}`,
          category: categorizePhoto(albumName, photo.name),
          createdAt: photo.created_time,
          width: bestImage.width,
          height: bestImage.height
        });
      }

      url = data.paging?.next || '';
    }

    return photos;
  }

  /**
   * Fetch all photos from the page (uploaded photos)
   */
  async getPagePhotos(limit = 200): Promise<GalleryImage[]> {
    const photos: GalleryImage[] = [];
    let url = `${GRAPH_API_BASE}/${this.pageId}/photos?type=uploaded&fields=id,images,name,created_time&limit=50&access_token=${this.accessToken}`;

    while (url && photos.length < limit) {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch page photos: ${error}`);
      }

      const data: FacebookPhotosResponse = await response.json();

      for (const photo of data.data) {
        if (!photo.images?.length) continue;

        const bestImage = getBestImage(photo.images);

        photos.push({
          id: `fb_${photo.id}`,
          src: bestImage.src,
          alt: photo.name || 'United Hands Bangladesh community photo',
          category: categorizePhoto(undefined, photo.name),
          createdAt: photo.created_time,
          width: bestImage.width,
          height: bestImage.height
        });
      }

      url = data.paging?.next || '';
    }

    return photos;
  }

  /**
   * Fetch photos since a specific date
   */
  async getPhotosSince(sinceDate: Date, limit = 100): Promise<GalleryImage[]> {
    const allPhotos = await this.getPagePhotos(limit);

    return allPhotos.filter(photo => new Date(photo.createdAt) > sinceDate);
  }

  /**
   * Fetch all photos from all albums plus page photos
   */
  async getAllPhotos(limit = 200): Promise<GalleryImage[]> {
    const allPhotos: GalleryImage[] = [];
    const seenIds = new Set<string>();

    // First, get page photos
    try {
      const pagePhotos = await this.getPagePhotos(limit);
      for (const photo of pagePhotos) {
        if (!seenIds.has(photo.id)) {
          seenIds.add(photo.id);
          allPhotos.push(photo);
        }
      }
    } catch (error) {
      console.error('Error fetching page photos:', error);
    }

    // Then, get photos from each album
    try {
      const albums = await this.getAlbums();

      for (const album of albums) {
        if (allPhotos.length >= limit) break;

        // Skip system albums like "Profile Pictures" or "Cover Photos"
        if (album.name === 'Profile Pictures' || album.name === 'Cover Photos') continue;

        try {
          const albumPhotos = await this.getAlbumPhotos(album.id, album.name, 50);

          for (const photo of albumPhotos) {
            if (!seenIds.has(photo.id) && allPhotos.length < limit) {
              seenIds.add(photo.id);
              allPhotos.push(photo);
            }
          }
        } catch (error) {
          console.error(`Error fetching album ${album.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }

    // Sort by date (newest first)
    allPhotos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allPhotos;
  }
}

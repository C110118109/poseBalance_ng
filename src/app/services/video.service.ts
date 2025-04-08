import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // API base URL - using hardcoded value for development
  // In a production environment, you would typically use the same origin
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {
    // You can also determine the API URL dynamically based on the current environment
    // Uncomment the line below if you want to use the same origin in production
    // this.apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
  }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/videos`);
  }

  getVideo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/videos/${id}`);
  }

  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/videos`, formData);
  }

  // Get URL for streaming the original video
  getOriginalVideoUrl(videoId: string): string {
    return `${this.apiUrl}/videos/${videoId}/stream`;
  }

  // Get URL for streaming the processed video
  getProcessedVideoUrl(videoId: string): string {
    return `${this.apiUrl}/videos/${videoId}/processed`;
  }

  // Get URL for streaming the web-compatible video (most reliable for browser playback)
  getWebCompatibleVideoUrl(videoId: string): string {
    return `${this.apiUrl}/videos/${videoId}/web_compatible`;
  }

  // Accept a relative URL from the backend and convert it to an absolute URL
  getDirectProcessedVideoUrl(url: string): string {
    // If the URL is already absolute, return it as is
    if (url.startsWith('http')) {
      return url;
    }

    // For development with different ports, replace with backend server
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;

    // If URL starts with a slash, append it to the base URL
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }

    // Otherwise, add a slash between base URL and the path
    return `${baseUrl}/${url}`;
  }
}

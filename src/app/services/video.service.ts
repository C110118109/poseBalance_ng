import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // This ensures the service is provided at the root level
})
export class VideoService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Get all videos
  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/videos`);
  }

  // Get a specific video
  getVideo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/videos/${id}`);
  }

  // Upload a new video
  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/videos`, formData);
  }

  // Get video streaming URL
  getVideoUrl(id: string): string {
    return `${this.apiUrl}/videos/${id}/stream`;
  }

  // Get processed video streaming URL
  getProcessedVideoUrl(id: string): string {
    return `${this.apiUrl}/videos/${id}/processed`;
  }
}

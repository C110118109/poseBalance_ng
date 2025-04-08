import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PRIMENG_MODULES } from "../../shared/primeng";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { VideoService } from '../../services/video.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-recognition',
  standalone: true,
  imports: [
    CommonModule,
    PRIMENG_MODULES,
    FormsModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './image-recognition.component.html',
  styleUrl: './image-recognition.component.scss'
})

export class ImageRecognitionComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // 選擇的影片
  selecting_video: string | null = null;
  currentVideo: any = null;
  videoUrl: string | null = null;
  videoSrc: SafeResourceUrl | null = null; // Sanitized URL for iframes if needed
  loading = true;

  // 選擇的辨識類型 (姿勢 or 平衡)
  selectedRecognition: string = 'posture'; // 預設為姿勢辨識

  // 影片選單
  videos: any[] = [];

  // 辨識類型選單
  recognitionTypes: any[] = [
    { name: "姿勢辨識", code: "posture" },
    { name: "重心平衡", code: "balance" }
  ];

  // A 選手 (姿勢)
  A_player: any[] = [];

  // B 選手 (姿勢)
  B_player: any[] = [];

  // A 選手 (重心平衡)
  A_player_balance: any[] = [];

  // B 選手 (重心平衡)
  B_player_balance: any[] = [];

  constructor(
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadVideos();

    // Check if we have a videoId in the query params
    this.route.queryParams.subscribe(params => {
      if (params['videoId']) {
        this.selecting_video = params['videoId'];
        this.loadVideoDetails(params['videoId']);
      } else {
        this.loading = false; // Set loading to false if there's no videoId
      }
    });
  }

  loadVideos() {
    this.loading = true;
    this.videoService.getVideos().subscribe({
      next: (data) => {
        // Filter only completed videos
        this.videos = data
          .filter(video => video.status === 'completed')
          .map(video => ({
            name: video.name,
            code: video.id
          }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videos', error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '加載視頻列表失敗'
        });
        this.loading = false;
      }
    });
  }

  loadVideoDetails(videoId: string) {
    this.loading = true;
    this.videoService.getVideo(videoId).subscribe({
      next: (data) => {
        this.currentVideo = data;

        console.log('Video details:', data);

        // OPTION 1: Try the web_compatible_url first if available
        if (data.web_compatible_url) {
          this.videoUrl = this.ensureAbsoluteUrl(data.web_compatible_url);
          console.log('Using web compatible URL:', this.videoUrl);
        }
        // OPTION 2: Use processed_url as the second choice
        else if (data.processed_url) {
          this.videoUrl = this.ensureAbsoluteUrl(data.processed_url);
          console.log('Using processed URL:', this.videoUrl);
        }
        // OPTION 3: Use the streaming endpoint as the last resort
        else {
          this.videoUrl = this.videoService.getWebCompatibleVideoUrl(videoId);
          console.log('Using streaming endpoint:', this.videoUrl);
        }

        // Create a sanitized URL for iframe fallback if needed
        this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);

        // Load analysis data
        if (data.pose_data) {
          this.A_player = data.pose_data.A_player || [];
          this.B_player = data.pose_data.B_player || [];
        }

        if (data.balance_data) {
          this.A_player_balance = data.balance_data.A_player || [];
          this.B_player_balance = data.balance_data.B_player || [];
        }

        this.loading = false;

        // Set timeout to init video player after DOM is updated
        setTimeout(() => {
          this.initVideoPlayer();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading video details', error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '加載視頻詳情失敗'
        });
        this.loading = false;
      }
    });
  }

  // Helper function to ensure URL is absolute
  private ensureAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }

    // Get base URL of the current application
    const baseUrl = window.location.origin;

    // If URL starts with a slash, append it to the base URL
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }

    // Otherwise, add a slash between base URL and the path
    return `${baseUrl}/${url}`;
  }

  initVideoPlayer() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;

      // Add event listeners to check if video is loaded
      videoElement.addEventListener('loadeddata', () => {
        console.log('Video data loaded successfully');
      });

      videoElement.addEventListener('error', (e) => {
        console.error('Video loading error:', e);

        // Try fallback to original video URL if processed version fails
        if (this.currentVideo && this.currentVideo.file_url) {
          console.log('Trying fallback to original video');
          this.videoUrl = this.ensureAbsoluteUrl(this.currentVideo.file_url);

          // Need to update the video source element
          const sourceElement = videoElement.querySelector('source');
          if (sourceElement) {
            sourceElement.src = this.videoUrl;
            videoElement.load(); // Reload the video with new source
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '錯誤',
            detail: '視頻加載失敗，請檢查視頻格式或重試'
          });
        }
      });
    } else {
      console.warn('Video player element not found');
    }
  }

  onConfirm() {
    if (this.selecting_video) {
      this.loadVideoDetails(this.selecting_video);

      // Update the URL with the selected video ID for better user experience
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { videoId: this.selecting_video },
        queryParamsHandling: 'merge'
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: '警告',
        detail: '請選擇影片'
      });
    }
  }

  // Function to seek video to specific timestamp
  seekToTime(timeString: string) {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      try {
        const timeParts = timeString.split(':');
        const minutes = parseInt(timeParts[0], 10);
        const seconds = parseInt(timeParts[1], 10);
        const totalSeconds = minutes * 60 + seconds;

        console.log(`Seeking to ${totalSeconds} seconds (${timeString})`);

        this.videoPlayer.nativeElement.currentTime = totalSeconds;
        this.videoPlayer.nativeElement.play().catch(err => {
          console.error('Error playing video:', err);
          this.messageService.add({
            severity: 'error',
            summary: '錯誤',
            detail: '無法播放視頻，可能是瀏覽器限制'
          });
        });
      } catch (error) {
        console.error('Error seeking to time:', error);
      }
    } else {
      console.warn('Video player not initialized');
    }
  }
}

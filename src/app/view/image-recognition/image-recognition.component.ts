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
  providers: [MessageService, VideoService], // Add VideoService to the providers array
  templateUrl: './image-recognition.component.html',
  styleUrl: './image-recognition.component.scss'
})

export class ImageRecognitionComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // 選擇的影片
  selecting_video: string | null = null;
  currentVideo: any = null;
  videoSrc: SafeResourceUrl | null = null;
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

        // Set video source
        const videoUrl = this.videoService.getProcessedVideoUrl(videoId);
        this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);

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

  onConfirm() {
    if (this.selecting_video) {
      this.loadVideoDetails(this.selecting_video);
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
      const timeParts = timeString.split(':');
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);
      const totalSeconds = minutes * 60 + seconds;

      this.videoPlayer.nativeElement.currentTime = totalSeconds;
      this.videoPlayer.nativeElement.play();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { PRIMENG_MODULES } from "../../shared/primeng";
import { VideoService } from '../../services/video.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule,
    HttpClientModule
  ],
  providers: [ConfirmationService, MessageService, VideoService], // Add VideoService here
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  search: string = '';
  videos: any[] = [];
  filteredVideos: any[] = [];
  loading = true;

  // header: 68px;search: 44.8px;標頭: 54.4px
  scrollHeight = (window.innerHeight - 68 - 44.8 - 54.4).toString() + "px";

  constructor(
    private videoService: VideoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.filterVideos();
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

  filterVideos() {
    if (!this.search) {
      this.filteredVideos = [...this.videos];
    } else {
      const searchLower = this.search.toLowerCase();
      this.filteredVideos = this.videos.filter(video =>
        video.name.toLowerCase().includes(searchLower)
      );
    }
  }

  onSearchChange() {
    this.filterVideos();
  }

  viewVideo(video: any) {
    if (video.status === 'completed') {
      this.router.navigate(['/ir'], {
        queryParams: { videoId: video.id }
      });
    }
  }

  deleteVideo(video: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '確定要刪除此影片嗎？',
      header: '刪除確認',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '確定',
      rejectLabel: '取消',
      accept: () => {
        // In a real application, you would call a delete API here
        // For now, we'll just remove it from the local array
        this.videos = this.videos.filter(v => v.id !== video.id);
        this.filterVideos();

        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '影片已成功刪除'
        });
      }
    });
  }

  getStatusTag(status: string): any {
    switch (status) {
      case 'processing':
        return {
          value: '辨識中',
          styleClass: 'bg-white border-1 border-round border-yellow-500 text-yellow-500'
        };
      case 'completed':
        return {
          value: '成功',
          styleClass: 'bg-white border-1 border-round border-green-500 text-green-500'
        };
      case 'failed':
        return {
          value: '失敗',
          styleClass: 'bg-white border-1 border-round border-red-500 text-red-500'
        };
      default:
        return {
          value: '上傳中',
          styleClass: 'bg-white border-1 border-round border-blue-500 text-blue-500'
        };
    }
  }
}

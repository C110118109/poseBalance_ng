import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PRIMENG_MODULES } from "../../shared/primeng";
import { FileUploadHandlerEvent } from "primeng/fileupload";
import { VideoService } from '../../services/video.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {

  video_form: FormGroup;
  videos: any[] = [];
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.video_form = this.fb.group({
      name: ['', Validators.required],
      opponent: ['', Validators.required],
      us: ['', Validators.required],
    });
  }

  // header: 68px;标题: 65.4px;标头: 54.4px
  scrollHeight = (window.innerHeight - 68 - 65.4 - 54.4).toString() + "px";

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        // Filter videos that are in processing status
        this.videos = data.filter(video => video.status === 'processing');
      },
      error: (error) => {
        console.error('Error loading videos', error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '加載視頻列表失敗'
        });
      }
    });
  }

  onUpload(event: FileUploadHandlerEvent) {
    this.selectedFile = event.files[0];

    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '請選擇視頻文件'
      });
      return;
    }

    if (!this.video_form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '請填寫所有必填字段'
      });
      return;
    }

    this.uploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.video_form.value.name);
    formData.append('opponent', this.video_form.value.opponent);
    formData.append('us', this.video_form.value.us);

    this.videoService.uploadVideo(formData).subscribe({
      next: (response) => {
        this.uploading = false;
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '視頻上傳成功'
        });

        // Reset form and selected file
        this.video_form.reset();
        this.selectedFile = null;

        // Reload the processing videos list
        this.loadVideos();
      },
      error: (error) => {
        this.uploading = false;
        console.error('Upload error', error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '視頻上傳失敗'
        });
      }
    });
  }

  onSelectFile(event: any) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      this.selectedFile = event.currentFiles[0];
    } else {
      this.selectedFile = null;
    }
  }

  onClearSelection() {
    this.selectedFile = null;
  }

  onSubmit() {
    if (!this.video_form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '請填寫所有必填字段'
      });
      return;
    }

    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '請選擇視頻文件'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.video_form.value.name);
    formData.append('opponent', this.video_form.value.opponent);
    formData.append('us', this.video_form.value.us);

    this.uploading = true;

    this.messageService.add({
      severity: 'info',
      summary: '上傳中',
      detail: '正在上傳視頻...',
      sticky: true
    });

    this.videoService.uploadVideo(formData).subscribe({
      next: (response) => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'info',
          summary: '處理中',
          detail: '視頻已上傳，正在進行姿勢和平衡分析...',
          sticky: true
        });

        // Poll for video status every 3 seconds
        const videoId = response.video_id;
        const statusCheck = setInterval(() => {
          this.videoService.getVideo(videoId).subscribe({
            next: (videoData) => {
              if (videoData.status === 'completed') {
                clearInterval(statusCheck);
                this.uploading = false;
                this.messageService.clear();
                this.messageService.add({
                  severity: 'success',
                  summary: '成功',
                  detail: '視頻處理完成'
                });

                // Reset form and selected file
                this.video_form.reset();
                this.selectedFile = null;

                // Reload the processing videos list
                this.loadVideos();

                // Navigate to the IR view with the processed video
                setTimeout(() => {
                  this.router.navigate(['/ir'], {
                    queryParams: { videoId: videoId }
                  });
                }, 1500);
              } else if (videoData.status === 'failed') {
                clearInterval(statusCheck);
                this.uploading = false;
                this.messageService.clear();
                this.messageService.add({
                  severity: 'error',
                  summary: '錯誤',
                  detail: '視頻處理失敗，請重試'
                });
              }
              // If still processing, continue polling
            },
            error: (err) => {
              console.error('Error checking video status:', err);
              // Don't clear the interval, try again
            }
          });
        }, 3000);

        // Set a timeout to stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(statusCheck);
          if (this.uploading) {
            this.uploading = false;
            this.messageService.clear();
            this.messageService.add({
              severity: 'warn',
              summary: '警告',
              detail: '視頻處理時間過長，請在首頁檢查處理狀態'
            });

            // Navigate to home page
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1500);
          }
        }, 5 * 60 * 1000); // 5 minutes timeout
      },
      error: (error) => {
        this.uploading = false;
        this.messageService.clear();
        console.error('Upload error', error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '視頻上傳失敗'
        });
      }
    });
  }
}

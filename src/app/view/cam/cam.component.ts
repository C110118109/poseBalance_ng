import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from "../../shared/primeng";
import { FormsModule } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cam',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './cam.component.html',
  styleUrl: './cam.component.scss'
})
export class CamComponent implements OnDestroy, OnInit {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private videoInterval: any;
  private captureInterval: any;

  isRecording = false;
  isCameraOpen = false;
  isAnalyzing = false;
  recordingTime = 0;
  formattedTime = '00:00';

  // balance results
  balance: any[] = [];

  // pose results
  pose: any[] = [];

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Initialize with empty arrays
    this.balance = [];
    this.pose = [];
  }

  openCamera() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: true
    })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.isCameraOpen = true;
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '攝影機已開啟'
        });
      })
      .catch(error => {
        console.error("無法開啟攝影機：", error);
        this.messageService.add({
          severity: 'error',
          summary: '錯誤',
          detail: '無法開啟攝影機，請確保您的設備有攝影機並已授權使用'
        });
      });
  }

  closeCamera() {
    if (this.isRecording) {
      this.stopRecording();
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.isCameraOpen = false;
      this.messageService.add({
        severity: 'info',
        summary: '關閉',
        detail: '攝影機已關閉'
      });
    }
  }

  startRecording() {
    if (!this.stream) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '請先開啟攝影機'
      });
      return;
    }

    // Reset arrays
    this.balance = [];
    this.pose = [];
    this.recordedChunks = [];
    this.recordingTime = 0;
    this.formattedTime = '00:00';

    // Start recording
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (e) {
      console.error('MediaRecorder error:', e);
      try {
        // Try with a different format if vp9 is not supported
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      } catch (e) {
        console.error('MediaRecorder error with vp8:', e);
        try {
          // Last attempt with basic format
          this.mediaRecorder = new MediaRecorder(this.stream);
        } catch (e) {
          this.messageService.add({
            severity: 'error',
            summary: '錯誤',
            detail: '您的瀏覽器不支持錄製功能'
          });
          return;
        }
      }
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording = false;
      this.analyzeRecording();
    };

    // Start recording with 1 second chunks
    this.mediaRecorder.start(1000);
    this.isRecording = true;

    // Update the timer
    this.videoInterval = setInterval(() => {
      this.recordingTime++;
      const minutes = Math.floor(this.recordingTime / 60);
      const seconds = this.recordingTime % 60;
      this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Simulate new balance or pose detection
      this.simulateDetection();

    }, 1000);

    this.messageService.add({
      severity: 'info',
      summary: '錄製',
      detail: '開始錄製影片'
    });
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      clearInterval(this.videoInterval);
      this.messageService.add({
        severity: 'info',
        summary: '錄製',
        detail: '停止錄製影片'
      });
    }
  }

  analyzeRecording() {
    if (this.recordedChunks.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: '警告',
        detail: '沒有錄製的數據可供分析'
      });
      return;
    }

    this.isAnalyzing = true;

    // Create a blob from the recorded chunks
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', blob, 'recorded-video.webm');
    formData.append('name', '即時錄製影片');
    formData.append('us', '本地選手');
    formData.append('opponent', '對手');

    // In a real application, you would send this to your backend for processing
    // For demo purposes, we'll just simulate the response
    setTimeout(() => {
      this.isAnalyzing = false;
      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '影片分析完成'
      });
    }, 3000);
  }

  simulateDetection() {
    // This is a simulation for demo purposes
    // In a real application, this data would come from your Python model
    const r = Math.random();

    // Random chance to add a balance or pose detection
    if (r < 0.3) {
      const balanceOptions = ["平衡", "重心偏左", "重心偏右", "不平衡"];
      const randomBalance = balanceOptions[Math.floor(Math.random() * balanceOptions.length)];

      this.balance.unshift({
        time: this.formattedTime,
        name: randomBalance
      });
    }

    if (r > 0.7) {
      const poseOptions = ["預備動作", "反拍挑球", "正手挑球", "攻擊", "平球"];
      const randomPose = poseOptions[Math.floor(Math.random() * poseOptions.length)];

      this.pose.unshift({
        time: this.formattedTime,
        name: randomPose
      });
    }

    // Keep only the last 8 items
    if (this.balance.length > 8) {
      this.balance = this.balance.slice(0, 8);
    }

    if (this.pose.length > 8) {
      this.pose = this.pose.slice(0, 8);
    }
  }

  // When component is destroyed, ensure camera and recording are closed
  ngOnDestroy() {
    this.closeCamera();
    clearInterval(this.videoInterval);
    clearInterval(this.captureInterval);
  }
}

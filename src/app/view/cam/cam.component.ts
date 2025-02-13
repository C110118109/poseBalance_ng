import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PRIMENG_MODULES } from "../../shared/primeng";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-cam',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule
  ],
  templateUrl: './cam.component.html',
  styleUrl: './cam.component.scss'
})
export class CamComponent implements OnDestroy {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | null = null;

  // A_player
  A_player: any[] = [
    { time: "00:10", name: "挑球" },
    { time: "00:33", name: "下旋球" },
    { time: "00:54", name: "平球" },
    { time: "01:25", name: "正手擊球" },
    { time: "01:38", name: "平球" },
    { time: "01:45", name: "正手擊球" },
    { time: "01:55", name: "下旋球" }
  ];

  // B_player
  B_player: any[] = [
    { time: "00:06", name: "挑球" },
    { time: "00:25", name: "下旋球" },
    { time: "01:20", name: "平球" },
    { time: "01:55", name: "挑球" },
    { time: "02:05", name: "下旋球" }
  ];

  openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error("無法開啟攝影機：", error);
      });
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // 當元件銷毀時，確保攝影機關閉
  ngOnDestroy() {
    this.closeCamera();
  }
}

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

  // balance
  balance: any[] = [
    { time: "00:05", name: "平衡" },
    { time: "00:07", name: "重心偏左" },
    { time: "00:34", name: "不平衡" },
    { time: "01:05", name: "重心偏右" },
    { time: "01:18", name: "重心偏右" },
    { time: "01:45", name: "不平衡" },
    { time: "01:55", name: "平衡" }
  ];

  // pose
  pose: any[] = [
    { time: "00:06", name: "預備動作" },
    { time: "00:08", name: "反拍挑球" },
    { time: "00:37", name: "反手挑球" },
    { time: "01:02", name: "攻擊" },
    { time: "01:23", name: "正手挑球" }
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

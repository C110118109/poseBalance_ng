import {Component} from '@angular/core';
import {PRIMENG_MODULES} from "../../shared/primeng";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-image-recognition',
  standalone: true,
  imports: [
    CommonModule,
    PRIMENG_MODULES,
    FormsModule
  ],
  templateUrl: './image-recognition.component.html',
  styleUrl: './image-recognition.component.scss'
})

export class ImageRecognitionComponent {
  // 選擇的影片
  selecting_video: any;

  // 選擇的辨識類型 (姿勢 or 平衡)
  selectedRecognition: string = 'posture'; // 預設為姿勢辨識

  // 影片選單
  videos: any[] = [
    { name: "美國公開賽", code: "US Open" },
    { name: "2020東京奧運", code: "Tokyo 2020" }
  ];

  // 辨識類型選單
  recognitionTypes: any[] = [
    { name: "姿勢辨識", code: "posture" },
    { name: "重心平衡", code: "balance" }
  ];

  // A 選手 (姿勢)
  A_player: any[] = [
    { time: "00:10", name: "預備動作" },
    { time: "00:33", name: "反拍挑球" },
    { time: "00:54", name: "平球" },
    { time: "01:25", name: "攻擊" },
    { time: "01:38", name: "反拍挑球" },
    { time: "01:45", name: "正手擊球" },
    { time: "01:55", name: "攻擊" }
  ];

  // B 選手 (姿勢)
  B_player: any[] = [
    { time: "00:06", name: "預備動作" },
    { time: "00:25", name: "攻擊" },
    { time: "01:20", name: "反手挑球" },
    { time: "01:55", name: "正手挑球" },
    { time: "02:05", name: "攻擊" }
  ];

  // A 選手 (重心平衡)
  A_player_balance: any[] = [
    { time: "00:10", state: "平衡" },
    { time: "00:33", state: "不平衡" },
    { time: "00:54", state: "重心偏右" },
    { time: "01:25", state: "重心偏右" },
    { time: "01:38", state: "平衡" },
    { time: "01:45", state: "平衡" },
    { time: "01:55", state: "重心偏左" }
  ];

  // B 選手 (重心平衡)
  B_player_balance: any[] = [
    { time: "00:06", state: "重心偏左" },
    { time: "00:25", state: "平衡" },
    { time: "01:20", state: "不平衡" },
    { time: "01:55", state: "不平衡" },
    { time: "02:05", state: "重心偏右" }
  ];
}


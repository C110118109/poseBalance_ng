import {Component} from '@angular/core';
import {PRIMENG_MODULES} from "../../shared/primeng";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-image-recognition',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule
  ],
  templateUrl: './image-recognition.component.html',
  styleUrl: './image-recognition.component.scss'
})
export class ImageRecognitionComponent{

  // 選擇的影片
  selecting_video: any;
  // 下拉選單
  videos: any[] = [
    {
      name: "美國公開賽",
      code: "US Open"
    },
    {
      name: "2020東京奧運",
      code: "Tokyo 2020"
    }
  ];
  // A_player
  A_player: any[]=[
    {
      time: "00:10",
      name: "挑球",
    },
    {
      time: "00:33",
      name: "下旋球",
    },
    {
      time: "00:54",
      name: "平球",
    },
    {
      time: "01:25",
      name: "正手擊球",
    },
    {
      time: "01:38",
      name: "平球",
    },
    {
      time: "01:45",
      name: "正手擊球",
    },
    {
      time: "01:55",
      name: "下旋球",
    },
  ]

  // B_player
  B_player: any[]=[
    {
      time: "00:06",
      name: "挑球",
    },
    {
      time: "00:25",
      name: "下旋球",
    },
    {
      time: "01:20",
      name: "平球",
    },
    {
      time: "01:55",
      name: "挑球",
    },
    {
      time: "02:05",
      name: "下旋球",
    }
  ]
}

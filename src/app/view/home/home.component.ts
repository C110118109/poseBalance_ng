import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PRIMENG_MODULES} from "../../shared/primeng";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  search!: string;
  // header: 68px;search: 44.8px;標頭: 54.4px
  scrollHeight = (window.innerHeight - 68  - 44.8 - 54.4).toString() + "px";
  // 創建有關羽球影片的data，欄位包刮 name 、 status("成功"、"辨識中") 、 created_at(格式 "2024.01.25")，幫我創建20筆資料
  videos: any[] = Array.from({length: 20}, (_, i) => {
    return {
      name: `羽球影片${i + 1}`,
      status: i % 2 === 0 ? "成功" : "辨識中",
      created_at: `2024.1.${i + 1}`
    };
  });
}

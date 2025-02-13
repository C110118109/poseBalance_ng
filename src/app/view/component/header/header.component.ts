import { Component } from '@angular/core';
import {PRIMENG_MODULES} from "../../../shared/primeng";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PRIMENG_MODULES
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}

import {Component} from '@angular/core';
import {PRIMENG_MODULES} from "../../../shared/primeng";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PRIMENG_MODULES
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}

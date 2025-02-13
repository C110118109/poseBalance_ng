import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import {LoginComponent} from "./view/component/login/login.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    loadChildren: () => import('./view/container/container.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

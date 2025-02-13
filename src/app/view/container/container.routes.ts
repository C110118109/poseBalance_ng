import {Routes} from '@angular/router';
import {ContainerComponent} from "./container.component";
import {ImageRecognitionComponent} from "../image-recognition/image-recognition.component";
import {HomeComponent} from "../home/home.component";
import {UploadComponent} from "../upload/upload.component";
import {CamComponent} from "../cam/cam.component";

export const routes: Routes = [
  {
    path: '', component: ContainerComponent, children: [
      {path: 'home', component: HomeComponent},
      {path: 'ir', component: ImageRecognitionComponent},
      {path: 'upload', component: UploadComponent},
      {path: 'cam', component: CamComponent},
    ]
  },
];

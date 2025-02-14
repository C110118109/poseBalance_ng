import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PRIMENG_MODULES} from "../../shared/primeng";
import {FileUploadHandlerEvent} from "primeng/fileupload";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  video_form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.video_form = this.fb.group({
      name: ['', Validators.required],
      opponent: ['', Validators.required],
      us: ['', Validators.required],
    });
  }

  // header: 68px;標題: 65.4px;標頭: 54.4px
  scrollHeight = (window.innerHeight - 68 - 65.4 - 54.4).toString() + "px";
  videos: any[] = Array.from({length: 20}, (_, i) => {
    return {
      name: `運動員影片${i + 1}`,
      status: "辨識中",
      created_at: `2025.1.${i + 1}`
    };
  });

  onUpload(event: FileUploadHandlerEvent) {
    let fileReader = new FileReader();
    let base64Data: string | undefined;
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        base64Data = fileReader.result?.toString().split(',')[1];
        console.log(base64Data);
      };
    }
  }
}

import { Component, Input } from '@angular/core';
import { PreviewService } from '../../../core/service/preview/preview.service';

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class Preview {
  @Input() previewHtml = ''; 
}

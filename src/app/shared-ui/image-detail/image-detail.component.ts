import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TandemvaultPictureDetail} from '../../domain/tandemvault/picture';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html'
})
export class ImageDetailComponent implements OnInit {

  @Input()
  detail: TandemvaultPictureDetail;

  @Output() downloadPicture = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  download(id: number) {
    this.downloadPicture.emit(id);
  }
}

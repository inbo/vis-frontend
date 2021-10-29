import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TandemvaultPictureDetail} from '../../domain/tandemvault/picture';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html'
})
export class ImageDetailComponent implements OnInit {

  @Input()
  canAddTags = true;

  @Input()
  detail: TandemvaultPictureDetail;

  @Output() downloadPicture = new EventEmitter<number>();
  @Output() addTags = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  download(id: number) {
    this.downloadPicture.emit(id);
  }

  tags(id: number) {
    this.addTags.emit(id);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {TandemvaultPicture} from '../../domain/tandemvault/picture';

@Component({
  selector: 'app-image-grid-item',
  templateUrl: './image-grid-item.component.html'
})
export class ImageGridItemComponent implements OnInit {

  @Input()
  picture: TandemvaultPicture;

  @Input()
  selectedPicture: TandemvaultPicture;

  constructor() { }

  ngOnInit(): void {
  }

}

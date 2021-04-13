import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html'
})
export class HeaderBannerComponent implements OnInit {

  @Input()
  description: string;
  @Input()
  url: string;

  show = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}

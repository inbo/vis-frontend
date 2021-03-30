import {Component, Input, OnInit} from '@angular/core';
import {NavigationLink} from '../../NavigationLinks';

@Component({
  selector: 'app-sidebar-navigation-link',
  templateUrl: './navigation-link.component.html'
})
export class NavigationLinkComponent implements OnInit {
  isExpanded = false;
  path: string = window.location.pathname;

  @Input() active = false;
  @Input() link: NavigationLink;


  constructor() {
  }

  ngOnInit(): void {
    this.isExpanded = this.link.sublinks.filter(value => value.url === this.path).length > 0;
  }

}

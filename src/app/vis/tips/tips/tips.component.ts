import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';

@Component({
  selector: 'vis-tips',
  templateUrl: './tips.component.html'
})
export class TipsComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Tips', url: '/tips/COMMON'}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}

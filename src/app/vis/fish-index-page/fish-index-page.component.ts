import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../shared-ui/breadcrumb/BreadcrumbLinks';

@Component({
  selector: 'app-fish-index-page',
  templateUrl: './fish-index-page.component.html'
})
export class FishIndexPageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Visindex', url: '/visindex'}
  ];

  constructor(private titleService: Title) {
    this.titleService.setTitle('Visindex');
  }

  ngOnInit(): void {
  }

}

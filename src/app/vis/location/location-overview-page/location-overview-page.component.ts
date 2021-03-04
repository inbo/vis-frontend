import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";

@Component({
  selector: 'app-location-overview-page',
  templateUrl: './location-overview-page.component.html'
})
export class LocationOverviewPageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ]

  constructor(private titleService: Title) {
    this.titleService.setTitle("Locaties")
  }

  ngOnInit(): void {
  }

}

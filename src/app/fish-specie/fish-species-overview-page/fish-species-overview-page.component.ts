import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";

@Component({
  selector: 'app-fish-species-overview-page',
  templateUrl: './fish-species-overview-page.component.html'
})
export class FishSpeciesOverviewPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
  ]

  constructor(private titleService: Title) {
    this.titleService.setTitle("Vissoorten")
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../GlobalConstants";
import {BreadcrumbLink} from "../shared-ui/breadcrumb/BreadcrumbLinks";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Mijn profiel', url: '/profiel'},
  ]

  constructor(private titleService: Title) {
    this.titleService.setTitle("Mijn V.I.S profiel")
  }

  ngOnInit(): void {
  }

}

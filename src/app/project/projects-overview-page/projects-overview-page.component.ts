import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";

@Component({
  selector: 'app-projects-overview-page',
  templateUrl: './projects-overview-page.component.html'
})
export class ProjectsOverviewPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'}
  ]

  constructor(private titleService: Title) {
    this.titleService.setTitle("Projecten")
  }

  ngOnInit(): void {
  }

}

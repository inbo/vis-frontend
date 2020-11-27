import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../model/project";
import {VisService} from "../../vis.service";

@Component({
  selector: 'app-projects-overview-page',
  templateUrl: './projects-overview-page.component.html'
})
export class ProjectsOverviewPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'}
  ]

  projects: Project[];
  pagedProjects: Project[];

  constructor(private titleService: Title, private visService: VisService) {
    this.titleService.setTitle("Projecten")
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pagedProjects = pageOfItems;
  }

  ngOnInit(): void {
    this.visService.getProjects().subscribe(value => {
      this.projects = value;
    })
  }

}

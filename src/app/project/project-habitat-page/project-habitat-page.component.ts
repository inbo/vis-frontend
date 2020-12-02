import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-project-habitat-page',
  templateUrl: './project-habitat-page.component.html'
})
export class ProjectHabitatPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode}
  ]

  project: Project;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.titleService.setTitle("Project " + this.activatedRoute.snapshot.params.projectCode)

    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.project = value)

  }

  ngOnInit(): void {
  }

}

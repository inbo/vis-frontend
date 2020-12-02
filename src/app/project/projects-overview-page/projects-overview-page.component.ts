import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {VisService} from "../../vis.service";
import {AsyncPage} from "../../shared-ui/paging-async/asyncPage";
import {Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectAddComponent} from "../project-add/project-add.component";

@Component({
  selector: 'app-projects-overview-page',
  templateUrl: './projects-overview-page.component.html'
})
export class ProjectsOverviewPageComponent implements OnInit {
  @ViewChild(ProjectAddComponent) projectAddComponent;

  loading: boolean = false;
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'}
  ]

  pager: AsyncPage<Project>;
  projects: Observable<Project[]>;
  isAddProjectOpen: boolean = false;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.titleService.setTitle("Projecten")
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.getProjects(params.page ? params.page : 1, params.size ? params.size : 20)
    });
  }

  getProjects(page: number, size: number) {
    this.loading = true;
    this.projects = of([])
    this.visService.getProjects(page, size).subscribe((value) => {
      this.pager = value;
      this.projects = of(value.content);
      this.loading = false;
    });
  }

  openAddProject() {
    this.projectAddComponent.open();
  }
}

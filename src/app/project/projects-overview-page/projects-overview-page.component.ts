import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {VisService} from "../../vis.service";
import {AsyncPage} from "../../shared-ui/paging-async/asyncPage";
import {Observable, of} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProjectAddComponent} from "../project-add/project-add.component";
import {FormBuilder, FormGroup} from "@angular/forms";

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

  filterForm: FormGroup;
  advancedFilterIsVisible: boolean = false;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Projecten")

    let queryParams = activatedRoute.snapshot.queryParams;
    this.filterForm = formBuilder.group(
      {
        name: [queryParams.name],
        description: [queryParams.description],
        status: [queryParams.status]
      },
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      this.filterForm.get('name').patchValue(params.name ? params.name : '')
      this.filterForm.get('description').patchValue(params.description ? params.description : '')
      this.filterForm.get('status').patchValue(params.status ? params.status : '')

      this.advancedFilterIsVisible = (params.description !== undefined && params.description !== '')
    });

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.getProjects(params.page ? params.page : 1, params.size ? params.size : 20)
    });
  }

  getProjects(page: number, size: number) {
    this.loading = true;
    this.projects = of([])
    this.visService.getProjects(page, size, this.filterForm.getRawValue()).subscribe((value) => {
      this.pager = value;
      this.projects = of(value.content);
      this.loading = false;
    });
  }

  openAddProject() {
    this.projectAddComponent.open();
  }

  filter() {
    let rawValue = this.filterForm.getRawValue();
    const queryParams: Params = {...rawValue, page: 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });

    this.getProjects(1, 20)
  }
}

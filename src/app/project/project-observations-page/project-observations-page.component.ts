import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AsyncPage} from "../../shared-ui/paging-async/asyncPage";
import {Observation} from "../model/observation";

@Component({
  selector: 'app-project-observations-page',
  templateUrl: './project-observations-page.component.html'
})
export class ProjectObservationsPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode}
  ]

  project: Project;

  loading: boolean = false;

  pager: AsyncPage<Observation>;
  observations: Observable<Observation[]>;

  filterForm: FormGroup;
  advancedFilterIsVisible: boolean = false;


  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Waarnemingen voor " + this.activatedRoute.snapshot.params.projectCode)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.project = value)

    let queryParams = activatedRoute.snapshot.queryParams;
    this.filterForm = formBuilder.group(
      {
        name: [queryParams.name],
        description: [queryParams.description],
        status: [queryParams.status],
        sort: [queryParams.sort]
      },
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      this.filterForm.get('name').patchValue(params.name ? params.name : '')
      this.filterForm.get('description').patchValue(params.description ? params.description : '')
      this.filterForm.get('status').patchValue(params.status ? params.status : '')
      this.filterForm.get('sort').patchValue(params.sort ? params.sort : '')

      this.advancedFilterIsVisible = (params.description !== undefined && params.description !== '')
    });

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.getObservations(params.page ? params.page : 1, params.size ? params.size : 20)
    });
  }

  getObservations(page: number, size: number) {
    this.loading = true;
    this.observations = of([])

    this.visService.getObservations(this.activatedRoute.snapshot.params.projectCode, page, size, this.filterForm.getRawValue()).subscribe((value) => {
      this.pager = value;
      this.observations = of(value.content);
      this.loading = false;
    });
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

    this.getObservations(1, 20)
  }

}

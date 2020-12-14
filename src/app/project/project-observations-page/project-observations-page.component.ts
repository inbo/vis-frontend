import {Component, OnInit} from '@angular/core';
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
import {Measurement} from "../model/measurement";

@Component({
  selector: 'project-observations-page',
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
  selectedObservation: Observation;

  filterForm: FormGroup;
  advancedFilterIsVisible: boolean = false;

  loadingMeasurments: boolean = false;
  pagerMeasurements: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;
  emptyMeasurementCells: Array<number>;

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
    const params = this.activatedRoute.snapshot.params
    this.getObservations(params.page ? params.page : 1, params.size ? params.size : 5)
  }

  getObservations(page: number, size: number) {
    this.loading = true;
    this.observations = of([])

    this.visService.getObservations(this.activatedRoute.snapshot.params.projectCode, page, size, this.filterForm.getRawValue()).subscribe((value) => {
      this.pager = value;
      this.observations = of(value.content);
      this.loading = false;

      if (value.content[0] !== null && value.content[0] !== undefined) {
        this.selectedObservation = value.content[0];
        this.getMeasurements(1, 15)
      }
    });
  }

  selectObservation(observation: Observation) {
    this.selectedObservation = observation;
    this.getMeasurements(1, 15);
  }

  getMeasurements(page: number, size: number) {
    if (this.selectedObservation === undefined) {
      return;
    }

    this.loadingMeasurments = true;
    this.measurements = of([])
    this.emptyMeasurementCells = Array(15)

    this.visService.getMeasurements(this.activatedRoute.snapshot.params.projectCode, this.selectedObservation.observationId, page, size).subscribe((value) => {
      this.pagerMeasurements = value;
      this.measurements = of(value.content);
      this.loadingMeasurments = false;
      this.emptyMeasurementCells = Array(15 - value.content.length);
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

  navigatedObservations(event: any) {
    this.getObservations(event.page, event.size)
  }

  navigatedMeasurements(event: any) {
    this.getMeasurements(event.page, event.size)
  }
}

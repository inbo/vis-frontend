import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
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

  loadingMeasurments: boolean = false;
  pagerMeasurements: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;
  emptyMeasurementCells: Array<number>;

  resetParams: Params;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Waarnemingen voor " + this.activatedRoute.snapshot.params.projectCode)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.project = value)

    this.activatedRoute.queryParams.subscribe((params) => {
      this.getObservations(params.page ? params.page : 1, params.size ? params.size : 5)
    });

    const queryParams = this.activatedRoute.snapshot.queryParams
    const page = !queryParams['meting_page'] ? 0 : queryParams['meting_page'];
    const size = !queryParams['meting_page'] ? 15 : queryParams['meting_size'];
    this.resetParams = {meting_page: page, meting_size: size};

  }

  ngOnInit(): void {
  }

  getObservations(page: number, size: number) {

    const queryParams = this.activatedRoute.snapshot.queryParams

    let currentPage = this.pager?.pageable.pageNumber + 1;
    let newPage = queryParams.page ? queryParams.page : 1;

    if (this.pager === undefined || currentPage !== parseInt(newPage)) {
      this.loading = true;
      this.observations = of([])

      this.visService.getObservations(this.activatedRoute.snapshot.params.projectCode, page, size).subscribe((value) => {
        this.pager = value;
        this.observations = of(value.content);
        this.loading = false;

        if (value.content[0] !== null && value.content[0] !== undefined) {
          this.setSelectedObservation();
          this.loadMeasurements()
        } else {
          this.selectedObservation = null;
        }
      });
    } else {
      this.setSelectedObservation();
      this.loadMeasurements()
    }
  }

  private setSelectedObservation() {
    this.observations.subscribe(value => {
      this.selectedObservation = value[0];
      const params = this.activatedRoute.snapshot.queryParams
      if (params.waarneming) {
        let selected = value.find(c => c.observationId.value === parseInt(params.waarneming));
        if (selected) {
          this.selectedObservation = selected;
        }
      }
    });
  }

  loadMeasurements() {
    if (this.selectedObservation === undefined) {
      return;
    }

    this.loadingMeasurments = true;
    this.measurements = of([])
    this.emptyMeasurementCells = Array(15)

    const queryParams = this.activatedRoute.snapshot.queryParams
    const page = !queryParams['meting_page'] ? 0 : queryParams['meting_page'];
    const size = !queryParams['meting_page'] ? 15 : queryParams['meting_size'];

    this.visService.getMeasurements(this.activatedRoute.snapshot.params.projectCode, this.selectedObservation.observationId.value, page, size).subscribe((value) => {
      this.pagerMeasurements = value;
      this.measurements = of(value.content);
      this.loadingMeasurments = false;
      this.emptyMeasurementCells = Array(15 - value.content.length);
    });
  }

  selectObservation(observation: Observation) {
    const queryParams: Params = {meting_page: 1, meting_size: 15, waarneming: observation.observationId.value};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
  }

  navigateToObservationDetail() {
    this.router.navigate(["/projecten", this.project.code.value, "waarnemingen", this.selectedObservation.observationId.value])
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../../vis.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Observable, of, Subscription} from "rxjs";
import {AsyncPage} from "../../../shared-ui/paging-async/asyncPage";
import {SurveyEvent} from "../model/surveyEvent";
import {Measurement} from "../model/measurement";

@Component({
  selector: 'project-survey-events-page',
  templateUrl: './project-survey-events-page.component.html'
})
export class ProjectSurveyEventsPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode}
  ]

  project: Project;

  loading: boolean = false;
  pager: AsyncPage<SurveyEvent>;
  surveyEvents: Observable<SurveyEvent[]>;
  selectedSurveyEvent: SurveyEvent;

  loadingMeasurments: boolean = false;
  pagerMeasurements: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;
  emptyMeasurementCells: Array<number>;

  resetParams: Params;

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Waarnemingen voor " + this.activatedRoute.snapshot.params.projectCode)

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getSurveyEvents(params.page ? params.page : 1, params.size ? params.size : 5)
      })
    );

    const queryParams = this.activatedRoute.snapshot.queryParams
    const page = !queryParams['meting_page'] ? 0 : queryParams['meting_page'];
    const size = !queryParams['meting_page'] ? 15 : queryParams['meting_size'];
    this.resetParams = {meting_page: page, meting_size: size};
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSurveyEvents(page: number, size: number) {

    const queryParams = this.activatedRoute.snapshot.queryParams

    let currentPage = this.pager?.pageable.pageNumber + 1;
    let newPage = queryParams.page ? queryParams.page : 1;

    if (this.pager === undefined || currentPage !== parseInt(newPage)) {
      this.loading = true;
      this.surveyEvents = of([])

      this.subscription.add(
        this.visService.getSurveyEvents(this.activatedRoute.snapshot.params.projectCode, page, size).subscribe((value) => {
          this.pager = value;
          this.surveyEvents = of(value.content);
          this.loading = false;

          if (value.content[0] !== null && value.content[0] !== undefined) {
            this.setSelectedSurveyEvent();
            this.loadMeasurements()
          } else {
            this.selectedSurveyEvent = null;
          }
        })
      );
    } else {
      this.setSelectedSurveyEvent();
      this.loadMeasurements()
    }
  }

  private setSelectedSurveyEvent() {
    this.subscription.add(
      this.surveyEvents.subscribe(value => {
        this.selectedSurveyEvent = value[0];
        const params = this.activatedRoute.snapshot.queryParams
        if (params.waarneming) {
          let selected = value.find(c => c.surveyEventId.value === parseInt(params.waarneming));
          if (selected) {
            this.selectedSurveyEvent = selected;
          }
        }
      })
    );
  }

  loadMeasurements() {
    if (this.selectedSurveyEvent === undefined) {
      return;
    }

    this.loadingMeasurments = true;
    this.measurements = of([])
    this.emptyMeasurementCells = Array(15)

    const queryParams = this.activatedRoute.snapshot.queryParams
    const page = !queryParams['meting_page'] ? 0 : queryParams['meting_page'];
    const size = !queryParams['meting_page'] ? 15 : queryParams['meting_size'];

    this.subscription.add(
      this.visService.getMeasurements(this.activatedRoute.snapshot.params.projectCode, this.selectedSurveyEvent.surveyEventId.value, page, size).subscribe((value) => {
        this.pagerMeasurements = value;
        this.measurements = of(value.content);
        this.loadingMeasurments = false;
        this.emptyMeasurementCells = Array(15 - value.content.length);
      })
    );
  }

  selectSurveyEvent(surveyEvent: SurveyEvent) {
    const queryParams: Params = {meting_page: 1, meting_size: 15, waarneming: surveyEvent.surveyEventId.value};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
  }

  navigateToSurveyEventDetail() {
    this.router.navigate(["/projecten", this.activatedRoute.snapshot.params.projectCode, "waarnemingen", this.selectedSurveyEvent.surveyEventId.value])
  }
}

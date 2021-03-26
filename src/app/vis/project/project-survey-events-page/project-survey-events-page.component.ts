import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEvent} from '../model/surveyEvent';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-project-survey-events-page',
  templateUrl: './project-survey-events-page.component.html'
})
export class ProjectSurveyEventsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  loading = false;
  pager: AsyncPage<SurveyEvent>;
  surveyEvents: Observable<SurveyEvent[]>;

  filterForm: FormGroup;
  advancedFilterIsVisible = false;

  private subscription = new Subscription();
  projectCode: string;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder) {
    this.titleService.setTitle(`Waarnemingen voor ${this.activatedRoute.parent.snapshot.params.projectCode}`);
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getSurveyEvents(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );

  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        watercourse: [queryParams.watercourse],
        period: [queryParams.period],
        sort: [queryParams.sort ?? ''],
        measuringPointNumber: [queryParams.measuringPointNumber],
        method: [queryParams.method]
      },
    );

    this.subscription.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
        .subscribe(_ => this.filter())
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getSurveyEvents(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        const period = params.period && (params.period[0] && params.period[1]) ?
          [new Date(params.period[0]), new Date(params.period[1])] : null;

        this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : '');
        this.filterForm.get('period').patchValue(period);
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
        this.filterForm.get('measuringPointNumber').patchValue(params.measuringPointNumber ? params.measuringPointNumber : '');
        this.filterForm.get('method').patchValue(params.method ? params.method : '');

        this.advancedFilterIsVisible = ((params.measuringPointNumber !== undefined && params.measuringPointNumber !== '') ||
          (params.method !== undefined && params.method !== ''));
      })
    );
  }

  getSurveyEvents(page: number, size: number) {

    const queryParams = this.activatedRoute.snapshot.queryParams;

    const currentPage = this.pager?.pageable.pageNumber + 1;
    const newPage = queryParams.page ? queryParams.page : 1;

    if (this.pager === undefined || currentPage !== parseInt(newPage, 10)) {
      this.loading = true;
      this.surveyEvents = of([]);

      this.subscription.add(
        this.visService.getSurveyEvents(this.activatedRoute.parent.snapshot.params.projectCode, page, size).subscribe((value) => {
          this.pager = value;
          this.surveyEvents = of(value.content);
          this.loading = false;
        })
      );
    }
  }

  filter() {
    if (this.filterForm.get('period').value?.length < 2) {
      return;
    }

    const rawValue = this.filterForm.getRawValue();
    const queryParams: Params = {...rawValue, page: 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();

    this.getSurveyEvents(1, 20);
  }

}

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Method} from '../../method/model/method';
import {Option} from '../../../shared-ui/searchable-select/option';
import {MethodsService} from '../../../services/vis.methods.service';

@Component({
  selector: 'app-project-survey-events-page',
  templateUrl: './project-survey-events-page.component.html'
})
export class ProjectSurveyEventsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  loading = false;
  pager: AsyncPage<SurveyEvent>;
  methods: Method[];

  surveyEvents$: Observable<SurveyEvent[]>;
  methods$ = new Subject<Option[]>();

  filterForm: FormGroup;
  advancedFilterIsVisible = false;

  private subscription = new Subscription();
  projectCode: string;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private methodsService: MethodsService,
              private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle(`Waarnemingen voor ${this.activatedRoute.parent.snapshot.params.projectCode}`);
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getSurveyEvents(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );

    this.subscription.add(this.methodsService.getAllMethods()
      .subscribe(methods => {
        this.methods$.next(methods.map(this.mapMethodToOption()));
        return this.methods = methods;
      }));
  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        watercourse: [queryParams.watercourse],
        municipality: [queryParams.municipality],
        basin: [queryParams.basin],
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
        this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : '');
        this.filterForm.get('basin').patchValue(params.basin ? params.basin : '');
        this.filterForm.get('period').patchValue(period);
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
        this.filterForm.get('measuringPointNumber').patchValue(params.measuringPointNumber ? params.measuringPointNumber : '');
        this.filterForm.get('method').patchValue(params.method ? JSON.parse(params.method) : '');

        this.advancedFilterIsVisible = ((params.basin !== undefined && params.basin !== '') ||
          (params.period !== undefined && params.period.length === 2) ||
          (params.measuringPointNumber !== undefined && params.measuringPointNumber !== '') ||
          (params.method !== undefined && params.method !== ''));
      })
    );
  }

  getSurveyEvents(page: number, size: number) {
    this.loading = true;
    this.surveyEvents$ = of([]);

    const filter = this.filterForm?.getRawValue();
    if (filter && filter.period?.length === 2) {
      filter.begin = new Date(filter.period[0]).toISOString();
      filter.end = new Date(filter.period[1]).toISOString();
      delete filter.period;
    }

    if (filter && filter.method) {
      console.log(filter.method);
      filter.method = filter.method.id;
    }

    this.subscription.add(
      this.surveyEventsService.getSurveyEvents(this.activatedRoute.parent.snapshot.params.projectCode, page, size, filter)
        .subscribe((value) => {
          this.pager = value;
          this.surveyEvents$ = of(value.content);
          this.loading = false;
        })
    );
  }

  filter() {
    if (this.filterForm.get('period').value?.length < 2) {
      return;
    }

    const rawValue = this.filterForm.getRawValue();
    if (rawValue && rawValue.method) {
      rawValue.method = JSON.stringify(rawValue.method);
    }
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

  getMethods(val: string) {
    this.methods$.next(
      this.methods.filter(value => value.description.toLowerCase().includes(val))
        .map(this.mapMethodToOption())
    );
  }

  public mapMethodToOption() {
    return value => {
      return {id: value.code, translateKey: `method.${value.code}`};
    };
  }
}

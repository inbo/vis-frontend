import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {Method} from '../../method/model/method';
import {Option} from '../../../shared-ui/searchable-select/option';
import {MethodsService} from '../../../services/vis.methods.service';
import {TaxaService} from '../../../services/vis.taxa.service';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

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
  species$ = new Subject<Option[]>();
  tags$ = new Subject<Tag[]>();

  filterForm: FormGroup;

  private subscription = new Subscription();
  projectCode: string;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private methodsService: MethodsService,
              private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
              private taxaService: TaxaService, private datePipe: DatePipe, private translateService: TranslateService) {
    this.titleService.setTitle(`Waarnemingen voor ${this.activatedRoute.parent.snapshot.params.projectCode}`);
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

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
        method: [queryParams.method],
        species: [queryParams.species]
      },
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
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
      const period = params.period && (params.period[0] && params.period[1]) ?
        [new Date(params.period[0]), new Date(params.period[1])] : null;

      this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : '');
      this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : '');
      this.filterForm.get('basin').patchValue(params.basin ? params.basin : '');
      this.filterForm.get('period').patchValue(period);
      this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
      this.filterForm.get('measuringPointNumber').patchValue(params.measuringPointNumber ? params.measuringPointNumber : '');

      // Timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.filterForm.get('method').patchValue(params.method ? JSON.parse(params.method) : '');
        this.filterForm.get('species').patchValue(params.species ? JSON.parse(params.species) : '');

        this.filter();
      });
    });
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
      filter.method = filter.method.id;
    }
    if (filter && filter.species) {
      filter.taxonId = filter.species.id;
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

  getSpecies(val: string) {
    this.taxaService.getTaxa(val).pipe(
      map(taxa => {
        return taxa.map(taxon => ({
          id: taxon.id.value,
          translateKey: `taxon.id.${taxon.id.value}`
        }));
      })
    ).subscribe(value => this.species$.next(value));
  }


  filter() {
    if (this.filterForm.get('period').value?.length < 2) {
      return;
    }

    this.setTags();

    const rawValue = this.filterForm.getRawValue();
    if (rawValue && rawValue.method) {
      rawValue.method = JSON.stringify(rawValue.method);
    }
    if (rawValue && rawValue.species) {
      rawValue.species = JSON.stringify(rawValue.species);
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

  private setTags() {
    const rawValue = this.filterForm.getRawValue();
    const tags: Tag[] = [];

    if (rawValue.watercourse) {
      tags.push(getTag('surveyEvent.watercourse', rawValue.watercourse, this.getCallback('watercourse')));
    }
    if (rawValue.municipality) {
      tags.push(getTag('surveyEvent.municipality', rawValue.municipality, this.getCallback('municipality')));
    }
    if (rawValue.basin) {
      tags.push(getTag('surveyEvent.basin', rawValue.basin, this.getCallback('basin')));
    }
    if (rawValue.period && rawValue.period.length === 2) {
      const period = `${this.datePipe.transform(rawValue.period[0], 'dd/MM/yyyy')} - ${this.datePipe.transform(rawValue.period[1], 'dd/MM/yyyy')}`;
      tags.push(getTag('surveyEvent.period', period, this.getCallback('period')));
    }
    if (rawValue.measuringPointNumber) {
      tags.push(getTag('surveyEvent.measuringPointNumber', rawValue.measuringPointNumber,
        this.getCallback('measuringPointNumber')));
    }
    if (rawValue.method) {
      tags.push(getTag('surveyEvent.method', this.translateService.instant(rawValue.method.translateKey),
        this.getCallback('method')));
    }
    if (rawValue.species) {
      tags.push(getTag('surveyEvent.species', this.translateService.instant(rawValue.species.translateKey),
        this.getCallback('species')));
    }
    if (rawValue.sort) {
      tags.push(getTag('surveyEvent.sort', this.translateService.instant(`surveyEvent.sortOption.${rawValue.sort}`),
        this.getCallback('sort')));
    }

    this.tags$.next(tags);
  }

  getCallback(formField: string) {
    return () => {
      this.filterForm.get(formField).reset();
      this.filter();
    };
  }

  reset() {
    this.setTags();
  }
}

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {Option} from '../../../shared-ui/searchable-select/option';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaxaService} from '../../../services/vis.taxa.service';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {map, take} from 'rxjs/operators';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {MethodGroup} from '../../../domain/method/method-group';
import {Method} from '../../../domain/method/method';

@Component({
  selector: 'app-survey-events-overview-page',
  templateUrl: './survey-events-overview-page.component.html'
})
export class SurveyEventsOverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Waarnemingen', url: '/waarnemingen'}
  ];

  loading = false;
  pager: AsyncPage<SurveyEvent>;
  methods: Method[];

  surveyEvents$: Observable<SurveyEvent[]>;
  methodGroups$: Observable<MethodGroup[]>;
  methods$ = new Subject<Option[]>();
  species$ = new Subject<Option[]>();
  tags$ = new Subject<Tag[]>();

  filterForm: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private methodsService: MethodsService,
              private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
              private taxaService: TaxaService, private datePipe: DatePipe, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Waarnemingen`);

    this.methodsService.getAllMethods().pipe(take(1))
      .subscribe(methods => {
        this.methods$.next(methods.map(this.mapMethodToOption()));
        return this.methods = methods;
      });

    this.methodGroups$ = this.methodsService.getAllMethodGroups();

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        watercourse: [queryParams.watercourse],
        municipality: [queryParams.municipality],
        basin: [queryParams.basin],
        period: [queryParams.period],
        sort: [queryParams.sort ?? ''],
        measuringPointNumber: [queryParams.measuringPointNumber],
        methodGroup: [queryParams.methodGroup],
        method: [queryParams.method],
        species: [queryParams.species],
        my: [queryParams.my]
      },
    );

    this.subscription.add(this.filterForm.get('methodGroup').valueChanges.subscribe(value => {
      this.methodsService.getMethodsForGroup(value)
        .pipe(take(1))
        .subscribe(methods => this.methods$.next(methods.map(this.mapMethodToOption())));
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription.add(this.activatedRoute.queryParams.subscribe((params) => {
      const period = params.period && (params.period[0] && params.period[1]) ?
        [new Date(params.period[0]), new Date(params.period[1])] : null;

      this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : '');
      this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : '');
      this.filterForm.get('basin').patchValue(params.basin ? params.basin : '');
      this.filterForm.get('period').patchValue(period);
      this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
      this.filterForm.get('measuringPointNumber').patchValue(params.measuringPointNumber ? params.measuringPointNumber : '');
      this.filterForm.get('methodGroup').patchValue(params.methodGroup ? params.methodGroup : '');
      this.filterForm.get('my').patchValue(params.my ? params.my : null);

      // Timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.filterForm.get('method').patchValue(params.method ? JSON.parse(params.method) : '');
        this.filterForm.get('species').patchValue(params.species ? JSON.parse(params.species) : '');

        this.filter(params.page ?? 1, params.size ?? 20);
      });
    }));
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
      this.surveyEventsService.getAllSurveyEvents(page, size, filter)
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


  filter(page?: number, size?: number) {
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
    const queryParams: Params = {...rawValue, page: page ?? 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();

    this.getSurveyEvents(page ?? 1, size ?? 20);
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
    if (rawValue.methodGroup) {
      tags.push(getTag('surveyEvent.methodGroup', this.translateService.instant('method.group.' + rawValue.methodGroup),
        this.getCallback('methodGroup')));
    }
    if (rawValue.method) {
      tags.push(getTag('surveyEvent.method', this.translateService.instant(rawValue.method.translateKey),
        this.getCallback('method')));
    }
    if (rawValue.species) {
      tags.push(getTag('surveyEvent.species', this.translateService.instant(rawValue.species.translateKey),
        this.getCallback('species')));
    }
    if (rawValue.my) {
      tags.push(getTag('surveyEvent.my', rawValue.my, this.getCallback('my')));
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
    this.filter();
  }
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MethodsService} from '../../../services/vis.methods.service';
import {Method} from '../../../domain/method/method';
import {MethodEditComponent} from '../method-edit/method-edit.component';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-methods-overview-page',
  templateUrl: './methods-overview-page.component.html'
})
export class MethodsOverviewPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Methodes', url: '/methodes'},
  ];

  @ViewChild(MethodEditComponent) methodEditComponent;

  loading = false;
  pager: AsyncPage<Method>;
  methods: Observable<Method[]>;

  filterForm: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private methodsService: MethodsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle('Methodes');

    const queryParams = activatedRoute.snapshot.queryParams;
    this.filterForm = formBuilder.group(
      {
        code: [queryParams.code],
        group: [queryParams.group],
        description: [queryParams.description],
        page: [queryParams.page ?? null],
        size: [queryParams.size ?? null]
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
        this.filterForm.get('code').patchValue(params.code ? params.code : '');
        this.filterForm.get('group').patchValue(params.group ? params.group : '');
        this.filterForm.get('description').patchValue(params.description ? params.description : '');
        this.filterForm.get('page').patchValue(params.page ? params.page : null);
        this.filterForm.get('size').patchValue(params.size ? params.size : null);

        this.getMethods();
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMethods() {
    this.loading = true;
    this.methods = of([]);

    const page = this.filterForm.get('page').value ?? 0;
    const size = this.filterForm.get('size').value ?? 20;

    this.subscription.add(
      this.methodsService.getMethods(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        this.methods = of(value.content);
        this.loading = false;
      })
    );
  }

  filter() {
    const rawValue = this.filterForm.getRawValue();
    const queryParams: Params = {...rawValue, page: 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();
  }

  openEdit(methodCode: string) {
    this.methodEditComponent.open(methodCode);
  }
}

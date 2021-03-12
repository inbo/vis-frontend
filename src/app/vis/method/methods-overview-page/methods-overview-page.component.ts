import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {AsyncPage} from "../../../shared-ui/paging-async/asyncPage";
import {Method} from "../model/method";
import {Observable, of, Subscription} from "rxjs";
import { FormGroup, FormBuilder } from '@angular/forms';
import {VisService} from "../../../vis.service";
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-methods-overview-page',
  templateUrl: './methods-overview-page.component.html'
})
export class MethodsOverviewPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Methodes', url: '/methodes'},
  ]

  loading: boolean = false;
  pager: AsyncPage<Method>;
  methods: Observable<Method[]>;

  filterForm: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Methodes")

    let queryParams = activatedRoute.snapshot.queryParams;
    this.filterForm = formBuilder.group(
      {
        code: [queryParams.code],
        group: [queryParams.group],
      },
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('code').patchValue(params.code ? params.code : '')
        this.filterForm.get('group').patchValue(params.group ? params.group : '')
      })
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getMethods(params.page ? params.page : 1, params.size ? params.size : 20)
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMethods(page: number, size: number) {
    this.loading = true;
    this.methods = of([])
    this.subscription.add(
      this.visService.getMethods(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        this.methods = of(value.content);
        this.loading = false;
      })
    );
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

    this.getMethods(1, 20)
  }

}

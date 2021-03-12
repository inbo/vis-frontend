import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VisService} from '../../../vis.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Taxon} from '../model/taxon';
import {TaxonGroup} from '../model/taxon-group';

@Component({
  selector: 'app-fish-species-overview-page',
  templateUrl: './fish-species-overview-page.component.html'
})
export class FishSpeciesOverviewPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
  ]

  loading: boolean = false;

  pager: AsyncPage<Taxon>;
  taxon: Observable<Taxon[]>;
  taxonGroups: TaxonGroup[]

  filterForm: FormGroup;
  advancedFilterIsVisible: boolean = false;

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle("Vissoorten")

    let queryParams = activatedRoute.snapshot.queryParams;
    this.filterForm = formBuilder.group(
      {
        nameDutch: [queryParams.nameDutch],
        nameScientific: [queryParams.nameScientific],
        taxonGroupCode: [queryParams.taxonGroupCode],
        taxonCode: [queryParams.taxonCode]
      },
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('nameDutch').patchValue(params.nameDutch ? params.nameDutch : '')
        this.filterForm.get('nameScientific').patchValue(params.nameScientific ? params.nameScientific : '')
        this.filterForm.get('taxonGroupCode').patchValue(params.taxonGroupCode ? params.taxonGroupCode : '')
        this.filterForm.get('taxonCode').patchValue(params.taxonCode ? params.taxonCode : '')

        this.advancedFilterIsVisible = (params.taxonCode !== undefined && params.taxonCode !== '')
      })
    );

  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getTaxon(params.page ? params.page : 1, params.size ? params.size : 20)
      })
    );

    this.subscription.add(
      this.visService.getTaxonGroups().subscribe((value => this.taxonGroups = value))
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTaxon(page: number, size: number) {
    this.loading = true;
    this.taxon = of([])
    this.subscription.add(
      this.visService.getTaxa(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        value.content.forEach(item => {
          item.taxonGroupText = item.taxonGroups.map(taxonGroup => taxonGroup.name).join(', ');
        })
        this.taxon = of(value.content);
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

    this.getTaxon(1, 20)
  }
}

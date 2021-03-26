import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Taxon} from '../../../domain/taxa/taxon';
import {TaxonGroup} from '../../../domain/taxa/taxon-group';
import {TaxaService} from '../../../services/vis.taxa.service';

@Component({
  selector: 'app-fish-species-overview-page',
  templateUrl: './fish-species-overview-page.component.html'
})
export class FishSpeciesOverviewPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
  ];

  loading = false;

  pager: AsyncPage<Taxon>;
  taxon: Observable<Taxon[]>;
  taxonGroups: AsyncPage<TaxonGroup>;

  filterForm: FormGroup;
  advancedFilterIsVisible = false;

  private subscription = new Subscription();

  constructor(private titleService: Title, private taxaService: TaxaService, private activatedRoute: ActivatedRoute, private router: Router,
              formBuilder: FormBuilder) {
    this.titleService.setTitle('Vissoorten');

    const queryParams = activatedRoute.snapshot.queryParams;
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
        this.filterForm.get('nameDutch').patchValue(params.nameDutch ? params.nameDutch : '');
        this.filterForm.get('nameScientific').patchValue(params.nameScientific ? params.nameScientific : '');
        this.filterForm.get('taxonGroupCode').patchValue(params.taxonGroupCode ? params.taxonGroupCode : '');
        this.filterForm.get('taxonCode').patchValue(params.taxonCode ? params.taxonCode : '');

        this.advancedFilterIsVisible = (params.taxonCode !== undefined && params.taxonCode !== '');
      })
    );

  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getTaxon(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );

    this.subscription.add(
      this.taxaService.getTaxonGroups().subscribe((value => this.taxonGroups = value))
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTaxon(page: number, size: number) {
    this.loading = true;
    this.taxon = of([]);
    this.subscription.add(
      this.taxaService.getFilteredTaxa(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        value.content.forEach(item => {
          // @ts-ignore
          item.taxonGroupText = item.taxonGroups.map(taxonGroup => taxonGroup.name).join(', ');
        });
        this.taxon = of(value.content);
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

    this.getTaxon(1, 20);
  }
}

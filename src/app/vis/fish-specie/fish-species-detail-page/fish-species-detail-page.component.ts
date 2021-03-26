import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {TaxonDetail} from '../model/taxon-detail';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {flatMap, map, pluck, take, toArray} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {TaxaService} from '../../../services/vis.taxa.service';

@Component({
  selector: 'app-fish-species-detail-page',
  templateUrl: './fish-species-detail-page.component.html',
})
export class FishSpeciesDetailPageComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
    {
      title: this.activatedRoute.snapshot.params.taxonId,
      url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId
    },
    {title: 'Details', url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId}
  ];

  taxon$: Observable<TaxonDetail>;
  taxonGroups$: Observable<string[]>;

  constructor(private titleService: Title, private taxaService: TaxaService, private activatedRoute: ActivatedRoute) {
    this.taxon$ = this.taxaService.getTaxon(this.activatedRoute.snapshot.params.taxonId);
    this.taxonGroups$ = this.taxon$.pipe(take(1), flatMap(value => value.taxonGroups), map(value => value.name), toArray());

    const taxonCode$ = this.taxon$.pipe(take(1), pluck('code', 'value'));
    this.subscription.add(taxonCode$.subscribe(code => this.titleService.setTitle(code)));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

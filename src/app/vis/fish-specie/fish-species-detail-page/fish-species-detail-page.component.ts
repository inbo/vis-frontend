import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {TaxonDetail} from '../../../domain/taxa/taxon-detail';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TaxaService} from '../../../services/vis.taxa.service';

@Component({
  selector: 'vis-fish-species-detail-page',
  templateUrl: './fish-species-detail-page.component.html',
})
export class FishSpeciesDetailPageComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
    {
      title: '',
      url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId
    },
    {title: 'Details', url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId}
  ];

  taxon: TaxonDetail;
  taxonGroups: string[];

  constructor(private titleService: Title, private taxaService: TaxaService, private activatedRoute: ActivatedRoute) {
    this.taxaService.getTaxon(this.activatedRoute.snapshot.params.taxonId).subscribe(value => {
      this.taxon = value;
      this.taxonGroups = this.taxon.taxonGroups.map(group => group.name);

      this.breadcrumbLinks[1].title = this.taxon.code.value;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

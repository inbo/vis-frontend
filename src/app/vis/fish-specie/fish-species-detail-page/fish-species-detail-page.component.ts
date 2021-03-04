import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {TaxonDetail} from '../model/taxon-detail';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-fish-species-detail-page',
  templateUrl: './fish-species-detail-page.component.html',
})
export class FishSpeciesDetailPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
    {
      title: this.activatedRoute.snapshot.params.taxonId,
      url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId
    },
    {title: 'Details', url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId}
  ]

  taxon: TaxonDetail;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.visService.getTaxon(this.activatedRoute.snapshot.params.taxonId).subscribe(value => {
      this.titleService.setTitle(value.code.value)
      value.taxonGroupText = value.taxonGroups.map(taxonGroup => taxonGroup.name).join(', ');
      this.taxon = value
    })
  }

  ngOnInit(): void {
  }

}

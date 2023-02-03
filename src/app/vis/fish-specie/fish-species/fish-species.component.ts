import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';
import {TaxaService} from '../../../services/vis.taxa.service';

@Component({
  selector: 'vis-fish-species',
  templateUrl: './fish-species.component.html'
})
export class FishSpeciesComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vissoorten', url: '/vissoorten'},
    {
      title: '',
      url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId
    },
    {title: 'Details', url: '/vissoorten/' + this.activatedRoute.snapshot.params.taxonId}
  ];

  constructor(private activatedRoute: ActivatedRoute, private taxaService: TaxaService) {
  }

  ngOnInit(): void {
    this.taxaService.getTaxon(this.activatedRoute.snapshot.params.taxonId).subscribe(value => {
      this.breadcrumbLinks[1].title = value.code.value;
    });

    this.activatedRoute.url.subscribe(() => {
      const name = this.activatedRoute.snapshot.firstChild.data.name;
      const url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/vissoorten/${this.activatedRoute.snapshot.params.taxonId}/${url}`
      };
    });
  }

}

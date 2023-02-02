import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-fishing-point',
  templateUrl: './fishing-point.component.html'
})
export class FishingPointComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Vispunten', url: '/vispunten'},
    {
      title: this.activatedRoute.snapshot.params.code,
      url: '/vispunten/' + this.activatedRoute.snapshot.params.code
    },
    {title: 'Details', url: '/vispunten/' + this.activatedRoute.snapshot.params.code}
  ];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      const name = this.activatedRoute.snapshot.firstChild.data.name;
      const url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/vispunten/${this.activatedRoute.snapshot.params.code}/${url}`
      };
    });
  }

}

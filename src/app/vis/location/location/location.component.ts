import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
    {
      title: this.activatedRoute.snapshot.params.code,
      url: '/locaties/' + this.activatedRoute.snapshot.params.code
    },
    {title: 'Details', url: '/locaties/' + this.activatedRoute.snapshot.params.code}
  ];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      const name = this.activatedRoute.snapshot.firstChild.data.name;
      const url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/locaties/${this.activatedRoute.snapshot.params.code}/${url}`
      };
    });
  }

}

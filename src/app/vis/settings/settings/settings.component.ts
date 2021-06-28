import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Instellingen', url: '/instellingen/gebruikers'},
    {title: 'Gebruikers', url: '/instellingen/gebruikers'},
    {title: '', url: ''}
  ];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      const name = this.activatedRoute.snapshot.firstChild.data.name;
      const url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/instellingen/${url}`
      };
    });
  }
}

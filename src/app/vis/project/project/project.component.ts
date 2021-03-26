import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Project} from '../../../domain/project/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: '', url: ''}
  ];
  project$: Observable<Project>;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      const name = this.activatedRoute.snapshot.firstChild.data.name;
      const url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/projecten/${this.activatedRoute.snapshot.params.projectCode}/${url}`
      };
    });
  }
}

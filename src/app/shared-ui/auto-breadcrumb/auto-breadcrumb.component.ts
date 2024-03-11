import {Component, OnInit} from '@angular/core';
import {BreadcrumbLink} from './auto-breadcrumb-link';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'vis-auto-breadcrumb',
  templateUrl: './auto-breadcrumb.component.html',
})
export class AutoBreadcrumbComponent implements OnInit {

  breadcrumbLinks: BreadcrumbLink[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.updateBreadcrumbs();
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.breadcrumbLinks = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  updateBreadcrumbs(): void {
    this.breadcrumbLinks = this.createBreadcrumbs(this.activatedRoute.root);
  }

  createBreadcrumbs = (route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadcrumbLink> = []) => {
    route.children.forEach(child => {
      child.snapshot.url.forEach((segment, index) => {
        const segmentPath = segment.path;
        if (segmentPath) {
          const newUrl = breadcrumbs.length === 0 ? `${url}/${segmentPath}` : `${breadcrumbs[breadcrumbs.length - 1].url}/${segmentPath}`;
          let title;

          const isDynamic = this.isDynamicSegment(segmentPath);
          if (isDynamic && child.snapshot.data.breadcrumbPrefix) {
            title = `${child.snapshot.data.breadcrumbPrefix}${segmentPath}`;
          } else {
            title = this.convertUrlSegmentToTitle(segmentPath);
          }

          breadcrumbs.push({title, url: newUrl});

          this.createBreadcrumbs(child, newUrl, breadcrumbs);
        }
      });
    });

    return breadcrumbs;
  };


  isDynamicSegment(segment: string): boolean {
    // Implement logic to identify a dynamic segment. This is a basic example.
    return /^[0-9a-zA-Z_-]+$/.test(segment) && segment.length > 20;
  }


  convertUrlSegmentToTitle(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

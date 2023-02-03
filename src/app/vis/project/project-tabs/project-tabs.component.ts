import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'vis-project-tabs',
  templateUrl: './project-tabs.component.html'
})
export class ProjectTabsComponent implements OnInit {

  projectCode$: Observable<string>;
  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.currentUrl = '/' + this.activatedRoute.snapshot.url.join('/');
    this.projectCode$ = this.activatedRoute.params.pipe(map(param => param.projectCode));
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }
}

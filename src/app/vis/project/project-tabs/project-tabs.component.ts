import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'project-tabs',
  templateUrl: './project-tabs.component.html'
})
export class ProjectTabsComponent implements OnInit {

  projectCode : string;
  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUrl = "/" + this.activatedRoute.snapshot.url.join("/")
    this.projectCode = this.activatedRoute.snapshot.params.projectCode;
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }
}

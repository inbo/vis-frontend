import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../shared-ui/layouts/sidebar-layout/NavigationLinks";
import {GlobalConstants} from "../GlobalConstants";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;

  constructor(private titleService: Title) {
    this.titleService.setTitle("VIS Dashboard")
  }

  ngOnInit(): void {
  }

}

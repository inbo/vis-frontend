import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {Title} from "@angular/platform-browser";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";

@Component({
  selector: 'app-methods-overview-page',
  templateUrl: './methods-overview-page.component.html'
})
export class MethodsOverviewPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Methodes', url: '/methodes'},
  ]

  constructor(private titleService: Title) {
    this.titleService.setTitle("Methodes")
  }

  ngOnInit(): void {
  }

}

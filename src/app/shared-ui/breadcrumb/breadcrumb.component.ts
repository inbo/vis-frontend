import {Component, Input, OnInit} from '@angular/core';
import {BreadcrumbLink} from './BreadcrumbLinks';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumbLinks: BreadcrumbLink[];

  constructor() {
  }

  ngOnInit(): void {
  }

}

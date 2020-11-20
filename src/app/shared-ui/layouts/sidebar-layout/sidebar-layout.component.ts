import {Component, Input, OnInit} from '@angular/core';
import {NavigationLink} from "./NavigationLinks";

@Component({
  selector: 'sidebar-layout',
  templateUrl: './sidebar-layout.component.html'
})
export class SidebarLayoutComponent implements OnInit {

  @Input() navigationLinks: NavigationLink[];
  isSidebarOpen: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}

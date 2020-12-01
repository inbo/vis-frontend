import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'project-tabs',
  templateUrl: './project-tabs.component.html'
})
export class ProjectTabsComponent implements OnInit {

  @Input() projectCode : string;

  constructor() { }

  ngOnInit(): void {
  }

}

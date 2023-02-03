import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vis-release-notes-tabs',
  templateUrl: './release-notes-tabs.component.html'
})
export class ReleaseNotesTabsComponent implements OnInit {

  @Input() releases: string[];

  constructor() {
  }

  ngOnInit(): void {
  }

}

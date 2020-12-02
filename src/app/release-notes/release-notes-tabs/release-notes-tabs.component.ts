import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'release-notes-tabs',
  templateUrl: './release-notes-tabs.component.html'
})
export class ReleaseNotesTabsComponent implements OnInit {

  @Input() releases: string[];

  constructor() { }

  ngOnInit(): void {
  }

}

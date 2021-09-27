import {Component, Input, OnInit} from '@angular/core';
import {Pager} from '../../paging/pager';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input()
  pager: Pager;

  constructor() { }

  ngOnInit(): void {
  }

}

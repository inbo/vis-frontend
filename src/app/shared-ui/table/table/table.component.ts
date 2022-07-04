import {Component, Input} from '@angular/core';
import {AsyncPage} from '../../paging-async/asyncPage';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
})
export class TableComponent<T> {

    @Input() pager: AsyncPage<T>;

}

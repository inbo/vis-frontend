import {Component, Input} from '@angular/core';
import {AsyncPage} from './asyncPage';
import {ActivatedRoute, Params, Router} from '@angular/router';

/**
 *
 */
@Component({
  selector: 'paging-async',
  templateUrl: './paging-async.component.html'
})
export class PagingAsyncComponent {
  @Input() pager: AsyncPage<any>;
  @Input() pageProperty: string = 'page';
  @Input() sizeProperty: string = 'size';
  @Input() resetParams: Params = {};

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {

  }

  setPage(page: number, size: number) {
    const queryParams: Params = {...this.resetParams, [this.pageProperty]: page, [this.sizeProperty]: size};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
  }

  next() {
    if (!this.pager.last) {
      this.setPage(this.pager.number + 2, this.pager.size)
    }
  }

  previous() {
    if (!this.pager.first) {
      this.setPage(this.pager.number, this.pager.size)
    }
  }

}

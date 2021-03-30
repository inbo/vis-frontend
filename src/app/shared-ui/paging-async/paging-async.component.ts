import {Component, Input} from '@angular/core';
import {AsyncPage} from './asyncPage';
import {ActivatedRoute, Params, Router} from '@angular/router';

/**
 *
 */
@Component({
  selector: 'app-paging-async',
  templateUrl: './paging-async.component.html'
})
export class PagingAsyncComponent {
  @Input() pager: AsyncPage<any>;
  @Input() pageProperty = 'page';
  @Input() sizeProperty = 'size';
  @Input() resetParams: Params = {};

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {

  }

  setPage(page: number, size: number) {
    const queryParams: Params = {...this.resetParams, [this.pageProperty]: page, [this.sizeProperty]: size};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();
  }

  next() {
    if (!this.pager.last) {
      this.setPage(this.pager.number + 2, this.pager.size);
    }
  }

  previous() {
    if (!this.pager.first) {
      this.setPage(this.pager.number, this.pager.size);
    }
  }

}

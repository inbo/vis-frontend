import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faSort, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-table-sort',
  templateUrl: './table-sort.component.html'
})
export class TableSortComponent implements OnInit, OnDestroy {
  icon = faSort;

  subscription = new Subscription();

  @Input()
  sortField: string;

  @Input()
  order = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.order === 'ASC') {
      this.icon = faSortUp;
    } else if (this.order === 'DESC') {
      this.icon = faSortDown;
    } else {
      this.icon = faSort;
    }

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        const value = params.sort;
        if (value === undefined || value === '') {
          this.order = '';
          this.icon = faSort;
        } else if (value.startsWith(this.sortField)) {
          const sortOrder = value.split(',')[1];

          if (sortOrder === 'DESC') {
            this.order = 'DESC';
            this.icon = faSortDown;
          } else {
            this.order = 'ASC';
            this.icon = faSortUp;
          }
        } else {
          this.order = '';
          this.icon = faSort;
        }

      })
    );

  }

  changeSort() {
    const nextOrder = this.nextOrder();

    const queryParams: Params = {sort: nextOrder === '' ? '' : this.sortField + ',' + nextOrder};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();
  }

  private nextOrder() {
    switch (this.order) {
      case 'ASC':
        return 'DESC';
      case 'DESC':
        return '';
      default:
        return 'ASC';
    }
  }
}

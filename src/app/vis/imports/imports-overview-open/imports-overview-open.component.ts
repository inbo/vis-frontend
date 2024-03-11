import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Import} from '../../../domain/imports/imports';
import {ImportsService} from '../../../services/vis.imports.service';

@Component({
  selector: 'vis-imports-overview',
  templateUrl: './imports-overview-open.component.html',
})
export class ImportsOverviewOpenComponent implements OnInit, OnDestroy {

  loading = false;
  imports: Import[];

  private subscription = new Subscription();

  constructor(private importsService: ImportsService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscription.add(
        this.activatedRoute.queryParams.subscribe((params) => {
          this.getOpenImports(params.page ? params.page : 1, params.size ? params.size : 20);
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getOpenImports(page: number, size: number) {
    this.loading = true;
    this.imports = [];
    this.importsService.getImports(page, size).subscribe({
      next: (value) => {
        this.imports = value.content;
        this.loading = false;
      },
    });
  }
}

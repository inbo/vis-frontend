import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Import} from '../../../domain/imports/imports';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-imports-overview-processed',
  templateUrl: './imports-overview-processed.component.html'
})
export class ImportsOverviewProcessedComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Importeren', url: '/importeren'},
  ];

  loading = false;
  imports: Import[];

  private subscription = new Subscription();

  constructor(private titleService: Title, private importsService: ImportsService, private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.titleService.setTitle('Imports');
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getImports(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getImports(page: number, size: number) {
    this.loading = true;
    this.imports = [];
    this.subscription.add(
      this.importsService.getProcessedImports(page, size).subscribe((value) => {
        this.imports = value.content;
        this.loading = false;
      })
    );
  }

}

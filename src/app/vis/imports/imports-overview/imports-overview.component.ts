import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Import} from '../../../domain/imports/imports';
import {ImportsService} from '../../../services/vis.imports.service';

@Component({
  selector: 'app-imports-overview',
  templateUrl: './imports-overview.component.html'
})
export class ImportsOverviewComponent implements OnInit, OnDestroy {

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
      this.importsService.getImports(page, size).subscribe((value) => {
        this.imports = value.content;
        this.loading = false;
      })
    );
  }

}

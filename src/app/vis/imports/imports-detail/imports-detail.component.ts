import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImportDetail} from '../../../domain/imports/imports';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-imports-detail',
  templateUrl: './imports-detail.component.html'
})
export class ImportsDetailComponent implements OnInit, OnDestroy {
  faTimesCircle = faTimesCircle;

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Importeren', url: '/importeren'},
    {
      title: 'Google Drive ID: ' + this.activatedRoute.snapshot.params.id,
      url: '/importeren/' + this.activatedRoute.snapshot.params.id
    }
  ];

  loading = true;

  private subscription = new Subscription();
  public importDetail: ImportDetail = {documentTitle: '', url: '', items: []};

  id: string;

  constructor(private titleService: Title, private importsService: ImportsService, private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.titleService.setTitle('Imports');
    this.id = this.activatedRoute.snapshot.params.id;
    this.importsService.getImport(this.id).subscribe(value => {
      this.importDetail = value;
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

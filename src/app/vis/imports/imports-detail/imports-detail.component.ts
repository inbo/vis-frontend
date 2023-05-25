import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImportDetail} from '../../../domain/imports/imports';
import {Role} from '../../../core/_models/role';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {AlertService} from '../../../_alert';

@Component({
  selector: 'vis-imports-detail',
  templateUrl: './imports-detail.component.html'
})
export class ImportsDetailComponent implements OnInit, OnDestroy {
  role = Role;

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
  hasInvalidDocument = true;

  constructor(private titleService: Title, private importsService: ImportsService, private activatedRoute: ActivatedRoute,
              private router: Router, private toastr: ToastrService,
              private alertService: AlertService) {
    this.titleService.setTitle('Imports');
    this.id = this.activatedRoute.snapshot.params.id;
    this.importsService.getImport(this.id).subscribe(value => {
      this.importDetail = value;
      this.loading = false;
      this.setIsDocumentValid();
    },
        error => {
        alertService.error('Validatie fouten', 'Het bewaren is niet gelukt, controleer alle gegevens of contacteer een verantwoordelijke.')
        }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doImport() {
    this.importsService.doImport(this.id).subscribe({
        next: () => {
            this.alertService.success('Het importeren is gelukt', "De gegevens zijn opgeslagen", false);
        }
    });
  }

    private setIsDocumentValid(): void {
      // TODO: this should preferably be set by the backend.
      this.hasInvalidDocument = !this.importDetail.items || this.importDetail.items.filter(item => {
          const hasInvalidSurveyEvent = item.surveyEvents.filter(surveyEvent => {
              const notValidMeasurements = surveyEvent.measurements.filter(measurement => {return !measurement.valid}).length > 0;
              return !(surveyEvent.fishingPoint.valid && surveyEvent.method.valid && surveyEvent.occurrence.valid && !surveyEvent.existingSurveyEventId) || notValidMeasurements;
          }).length > 0;
          return !item.project.valid || hasInvalidSurveyEvent;
      }).length > 0;
  }
}

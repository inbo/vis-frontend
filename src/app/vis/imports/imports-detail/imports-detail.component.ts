import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImportDetail, ImportSurveyEventFishingPoint} from '../../../domain/imports/imports';
import {Role} from '../../../core/_models/role';
import {ToastrService} from 'ngx-toastr';
import {AlertService} from '../../../_alert';
import {AuthService} from '../../../core/auth.service';

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
  projectId: string;
  hasCreateSurveyEventRole: boolean;
  uniqueFishingPoints: ImportSurveyEventFishingPoint[] = [];

  constructor(private titleService: Title, private importsService: ImportsService, private activatedRoute: ActivatedRoute,
              private router: Router, private toastr: ToastrService,
              private alertService: AlertService, private authService: AuthService) {
      this.hasCreateSurveyEventRole = this.authService.hasRole(Role.CreateSurveyEvent);
    this.titleService.setTitle('Imports');
    this.id = this.activatedRoute.snapshot.params.id;
    this.importsService.getImport(this.id).subscribe(value => {
      this.importDetail = value;
      this.loading = false;
      this.setIsDocumentValid();
      this.projectId = this.importDetail.items[0].project.code;
      this.setFishingPointDetails();
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
                this.router.navigate(['/projecten', this.projectId]).then(() => {
                    this.alertService.success('Het importeren is gelukt', "De gegevens zijn opgeslagen", true);
            });
        },
        error: (error) => {
            console.error('Import error:', error);
            this.alertService.error('Er is een fout opgetreden tijdens het importeren.', 'Fout');
        }
    });
  }

    private setIsDocumentValid(): void {
        // Check if any item has invalid details
        this.hasInvalidDocument = this.importDetail.items.some(item => {
            // Check if the project is not valid
            if (!item.project.valid) {
                return true;
            }

            // Check if any survey event is invalid
            return item.surveyEvents.some(surveyEvent => {
                // Check if any of the conditions make the survey event invalid
                return !(surveyEvent.fishingPoint.valid && surveyEvent.method.valid &&
                        surveyEvent.occurrence.valid && !surveyEvent.existingSurveyEventId) ||
                    surveyEvent.measurements.some(measurement => !measurement.valid);
            });
        });
    }


    private setFishingPointDetails() {
        this.importDetail.items.forEach(project => {
            project.surveyEvents.forEach(event => {
                const fp = this.uniqueFishingPoints.find(fp => fp.value === event.fishingPoint.value);
                if(!fp) {
                    this.uniqueFishingPoints.push(event.fishingPoint);
                }
            })
        })
    }

    isNull(value: any): boolean {
        return value === null;
    }
}

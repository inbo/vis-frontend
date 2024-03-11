import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImportDetail, ImportSurveyEventFishingPoint} from '../../../domain/imports/imports';
import {Role} from '../../../core/_models/role';
import {ToastrService} from 'ngx-toastr';
import {AlertService} from '../../../_alert';
import {AuthService} from '../../../core/auth.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'vis-imports-detail',
  templateUrl: './imports-detail.component.html',
})
export class ImportsDetailComponent implements OnInit, OnDestroy {
  role = Role;
  loading = true;
  importDetail: ImportDetail = {documentTitle: '', url: '', items: []};
  id: string;
  hasInvalidDocument = true;
  projectId: string;
  hasCreateSurveyEventRole: boolean;
  uniqueFishingPoints: ImportSurveyEventFishingPoint[] = [];
  isReadOnly = false;

  private subscription = new Subscription();

  constructor(private titleService: Title,
              private importsService: ImportsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private alertService: AlertService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.hasCreateSurveyEventRole = this.authService.hasRole(Role.CreateSurveyEvent);
    this.subscription.add(
        this.activatedRoute.url.subscribe({
          next: (segments) => {
            this.isReadOnly = segments.find(segment => {
              return segment.path === 'afgesloten';
            }) !== undefined;
          },
        }),
    );
    this.subscription.add(
        this.activatedRoute.paramMap
            .pipe(
                filter(params => params.has('importId')),
                switchMap(params => {
                  this.id = params.get('importId');
                  return this.importsService
                      .getImport(this.id);
                }),
            ).subscribe({
              next: value => {
                this.importDetail = value;
                this.loading = false;
                this.setIsDocumentValid();
                this.projectId = this.importDetail.items[0].project.code;
                this.setFishingPointDetails();
              },
              error: (error) => {
                console.error(error);
                this.alertService.error('Validatie fouten', 'Het bewaren is niet gelukt, controleer alle gegevens of contacteer een verantwoordelijke.');
              },
            },
        ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doImport() {
    this.importsService.doImport(this.id).subscribe({
      next: () => {
        this.router.navigate(['/projecten', this.projectId]).then(() => {
          this.alertService.success('Het importeren is gelukt', 'De gegevens zijn opgeslagen', true);
        });
      },
      error: (error) => {
        console.error('Import error:', error);
        this.alertService.error('Er is een fout opgetreden tijdens het importeren.', 'Fout');
      },
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
        if (!fp) {
          this.uniqueFishingPoints.push(event.fishingPoint);
        }
      });
    });
  }

  isNull(value: any): boolean {
    return value === null;
  }
}

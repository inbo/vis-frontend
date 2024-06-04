import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ImportsService} from '../../../services/vis.imports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingPointDetail, ImportDetail, ImportSurveyEventFishingPoint} from '../../../domain/imports/imports';
import {Role} from '../../../core/_models/role';
import {ToastrService} from 'ngx-toastr';
import {AlertService} from '../../../_alert';
import {AuthService} from '../../../core/auth.service';
import {switchMap} from 'rxjs/operators';
import {faExclamation} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'vis-imports-detail',
  templateUrl: './imports-detail.component.html',
})
export class ImportsDetailComponent implements OnInit, OnDestroy {

  readonly faExclamation = faExclamation;

  role = Role;
  loading = true;
  importDetail: ImportDetail = {documentTitle: '', url: '', items: []};
  id: string;
  hasInvalidDocument = true;
  projectId: string;
  hasCreateSurveyEventRole: boolean;
  uniqueFishingPoints: ImportSurveyEventFishingPoint[] = [];
  isReadOnly = false;
  isImporting = false;

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
    this.isImporting = true;
    this.importsService.doImport(this.id).subscribe({
      next: (response) => {
        this.isImporting = false;
        // TODO: error interceptor is too generic and does not allow for use cases
        //  where you don't want to go to forbidden page, but simply show an alert.
        if (response?.code === 400) {
          this.alertService.error('Fout', 'Je hebt niet de juiste rechten om gegevens te importeren in dit project. Laat dit uitvoeren door iemand van het team betrokken bij dit project.', false);
        } else {
          this.router.navigate(['/projecten', this.projectId]).then(() => {
            this.alertService.success('Het importeren is gelukt', 'De gegevens zijn opgeslagen', true);
          });
        }
      },
      error: (error) => {
        this.isImporting = false;
        console.error('Import error:', error);
        this.alertService.error('Er is een fout opgetreden tijdens het importeren.', 'Fout');
      },
    });
  }

  showTooltipForValue(detail: FishingPointDetail): boolean {
    return ['X', 'Y', 'Gematched waterlichaam'].includes(detail.parameterName) && detail.value !== 'Niets gevonden';
  }

  getTooltipForValue(detail: FishingPointDetail): string {
    if (detail.parameterName === 'X' || detail.parameterName === 'Y') {
      return 'De meetplaatscode bestaat reeds in de databank, maar de opgegeven coördinaten wijken hiervan af. Gelieven na te kijken. Mogelijk ligt dit aan de nauwkeurigheid van de coördinaten of gaat het om een ander vispunt.';
    } else if (detail.parameterName === 'Gematched waterlichaam') {
      return 'De meetplaatscode bestaat reeds in de databank, maar de opgegeven waterlichaamcode wijkt hiervan af. Gelieven na te kijken. Mogelijk gaat het om een verschillend vispunt en dient u een andere meetplaatscode te hanteren.';
    }
    return '';
  }

  isRegularParameter(detail: FishingPointDetail): boolean {
    return detail.value && detail.value !== 'Niets gevonden' && !this.showTooltipForValue(detail);
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

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';
import {map, take} from 'rxjs/operators';
import {LocationsService} from '../../../services/vis.locations.service';
import {Method} from '../../../domain/method/method';
import {MethodsService} from '../../../services/vis.methods.service';
import {Role} from '../../../core/_models/role';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {TranslateService} from '@ngx-translate/core';
import {FishingPointSearch} from '../../../domain/location/fishing-point';

@Component({
  selector: 'app-survey-event-detail-edit-page',
  templateUrl: './survey-event-detail-edit-page.component.html'
})
export class SurveyEventDetailEditPageComponent implements OnInit {

  public role = Role;

  surveyEventForm: FormGroup;
  submitted = false;
  surveyEvent: SurveyEvent;

  locations: SearchableSelectOption[] = [];
  methods: SearchableSelectOption[] = [];

  constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
              private methodsService: MethodsService, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.surveyEventForm = this.formBuilder.group(
      {
        occurrenceDate: [null, [Validators.required]],
        location: [null, [Validators.required]],
        method: [''],
        comment: ['', Validators.maxLength(800)]
      });

    this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(surveyEvent => {
        this.surveyEvent = surveyEvent;

        this.occurrenceDate.patchValue(new Date(surveyEvent.occurrence));
        this.location.patchValue(surveyEvent.fishingPoint?.id);
        this.comment.patchValue(surveyEvent.comment);

        this.getLocations(null);
      });

    this.getMethods(null);
  }

  getLocations(val: any) {
    this.locationsService.searchFishingPoints(val, this.surveyEvent?.fishingPoint?.id).pipe(
      take(1),
      map(fishingPoints => {
        return fishingPoints.map(fishingPoint => ({
          selectValue: fishingPoint.id,
          option: fishingPoint
        }));
      })
    ).subscribe(value => this.locations = value as any as SearchableSelectOption[]);
  }

  getMethods(val: string) {
    this.methodsService.getAllMethods().pipe(
      take(1),
      map((values: Method[]) => val === null ? values : values.filter(value => value.description.toLowerCase().includes(val))),
      map(methods => {
        return methods.map(method => ({
          selectValue: method.code,
          option: method
        }));
      })
    ).subscribe(value => this.methods = value as any as SearchableSelectOption[]);

  }

  saveSurveyEvent() {
    this.submitted = true;

    if (this.surveyEventForm.invalid) {
      return;
    }

    const formData = this.surveyEventForm.getRawValue();
    formData.fishingPointId = formData.location;
    delete formData.location;

    this.surveyEventService.updateSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId, formData)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
          'waarnemingen', this.activatedRoute.parent.snapshot.params.surveyEventId]).then();
      });
  }

  deleteSurveyEvent() {
    this.surveyEventService.deleteSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
          'waarnemingen', this.activatedRoute.parent.snapshot.params.surveyEventId]).then();
      });
  }

  /*
    reset() {

    }
  */

  get occurrenceDate() {
    return this.surveyEventForm.get('occurrenceDate');
  }

  get location() {
    return this.surveyEventForm.get('location');
  }

  get method() {
    return this.surveyEventForm.get('method');
  }

  get comment() {
    return this.surveyEventForm.get('comment');
  }
}

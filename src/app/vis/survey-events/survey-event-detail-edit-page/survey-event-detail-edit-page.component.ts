import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {Option} from '../../../shared-ui/searchable-select/option';
import {Subject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {LocationsService} from '../../../services/vis.locations.service';
import {Method} from '../../../domain/method/method';
import {MethodsService} from '../../../services/vis.methods.service';
import {Role} from '../../../core/_models/role';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';

@Component({
  selector: 'app-survey-event-detail-edit-page',
  templateUrl: './survey-event-detail-edit-page.component.html'
})
export class SurveyEventDetailEditPageComponent implements OnInit {

  public role = Role;

  surveyEventForm: FormGroup;
  submitted = false;
  methods: Method[];
  surveyEvent: SurveyEvent;

  locations$ = new Subject<Option[]>();
  methods$ = new Subject<Option[]>();


  constructor(private titleService: Title, private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
              private methodsService: MethodsService) {
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
        this.location.patchValue({
          id: surveyEvent.fishingPoint?.id,
          translateKey: `fishing-point.id.${surveyEvent.fishingPoint?.id}.code`,
          secondaryTranslateKey: `fishing-point.id.${surveyEvent.fishingPoint?.id}`
        });
        this.surveyEventForm.get('method').patchValue({id: surveyEvent.method, translateKey: `method.${surveyEvent.method}`});
        this.comment.patchValue(surveyEvent.comment);
      });

    this.methodsService.getAllMethods().pipe(take(1))
      .subscribe(methods => {
        this.methods$.next(methods.map(this.mapMethodToOption()));
        return this.methods = methods;
      });
  }

  getLocations(val: any) {
    this.locationsService.searchFishingPoints(val).pipe(
      map(fishingPoints => {
        return fishingPoints.map(fishingPoint => ({
          id: fishingPoint.id,
          translateKey: `fishing-point.id.${fishingPoint.id}.code`,
          secondaryTranslateKey: `fishing-point.id.${fishingPoint.id}`
        }));
      })
    ).subscribe(value => this.locations$.next(value));
  }

  getMethods(val: string) {
    this.methods$.next(
      this.methods.filter(value => value.description.toLowerCase().includes(val))
        .map(this.mapMethodToOption())
    );
  }

  mapMethodToOption() {
    return value => {
      return {id: value.code, translateKey: `method.${value.code}`};
    };
  }

  saveSurveyEvent() {
    this.submitted = true;

    if (this.surveyEventForm.invalid) {
      return;
    }

    const formData = this.surveyEventForm.getRawValue();
    formData.fishingPointId = formData.location.id;
    formData.method = formData.method.id;
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

  get comment() {
    return this.surveyEventForm.get('comment');
  }
}

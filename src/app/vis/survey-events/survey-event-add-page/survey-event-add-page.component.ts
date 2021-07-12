import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Method} from '../../../domain/method/method';
import {Subject} from 'rxjs';
import {Option} from '../../../shared-ui/searchable-select/option';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-survey-event-add-page',
  templateUrl: './survey-event-add-page.component.html'
})
export class SurveyEventAddPageComponent implements OnInit {

  createSurveyEventForm: FormGroup;
  isOpen = false;
  submitted = false;
  methods: Method[];

  locations$ = new Subject<Option[]>();
  methods$ = new Subject<Option[]>();

  constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
              private methodsService: MethodsService) {
  }

  ngOnInit(): void {
    this.createSurveyEventForm = this.formBuilder.group(
      {
        occurrenceDate: [null, [Validators.required]],
        location: [null, [Validators.required]],
        method: [''],
        comment: ['', Validators.maxLength(800)]
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

  createSurveyEvent() {
    this.submitted = true;

    if (this.createSurveyEventForm.invalid) {
      return;
    }

    const formData = this.createSurveyEventForm.getRawValue();
    formData.fishingPointId = formData.location.id;
    formData.method = formData.method.id;
    delete formData.location;

    this.surveyEventService.createSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode, formData)
      .pipe(take(1))
      .subscribe(
        (surveyEvent) => {
          this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
            'waarnemingen', surveyEvent.surveyEventId.value]).then();
        }
      );
  }

  cancel() {
    this.isOpen = false;
    this.submitted = false;
  }

  get occurrenceDate() {
    return this.createSurveyEventForm.get('occurrenceDate');
  }

  get location() {
    return this.createSurveyEventForm.get('location');
  }

  get comment() {
    return this.createSurveyEventForm.get('comment');
  }
}

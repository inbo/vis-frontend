import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {map, take} from 'rxjs/operators';
import {Method} from '../../../domain/method/method';
import {Location} from '@angular/common';
import {HasUnsavedData} from '../../../core/core.interface';
import {ProjectService} from '../../../services/vis.project.service';
import {DatepickerComponent} from '../../../shared-ui/datepicker/datepicker.component';
import {uniqueValidator} from '../survey-event-validators';

@Component({
  selector: 'app-survey-event-add-page',
  templateUrl: './survey-event-add-page.component.html'
})
export class SurveyEventAddPageComponent implements OnInit, HasUnsavedData {

  @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;

  createSurveyEventForm: FormGroup;
  isOpen = false;
  submitted = false;

  locations: SearchableSelectOption[] = [];
  methods: SearchableSelectOption[] = [];

  constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
              private methodsService: MethodsService, private _location: Location, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode)
      .pipe(take(1))
      .subscribe(value => {
        this.datepicker.setMinDate(new Date(value.start));
        if (value.end) {
          this.datepicker.setMaxDate(new Date(value.end));
        }
      });


    this.createSurveyEventForm = this.formBuilder.group(
      {
        occurrenceDate: [null, [Validators.required]],
        location: [null, [Validators.required]],
        method: [null],
        comment: ['', Validators.maxLength(800)]
      }, {asyncValidators: [uniqueValidator(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventService)]});

    this.getMethods(null);
  }

  getLocations(val: any) {
    this.locationsService.searchFishingPoints(val, null).pipe(
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
    ).subscribe(value => {
      return this.methods = value as any as SearchableSelectOption[];
    });

  }

  createSurveyEvent() {
    this.submitted = true;

    if (this.createSurveyEventForm.invalid) {
      return;
    }

    const formData = this.createSurveyEventForm.getRawValue();
    formData.fishingPointId = formData.location;
    delete formData.location;

    this.surveyEventService.createSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode, formData)
      .pipe(take(1))
      .subscribe(
        (surveyEvent) => {
          this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
            'waarnemingen', surveyEvent.surveyEventId]).then();
        }
      );
  }

  hasUnsavedData(): boolean {
    return this.createSurveyEventForm.dirty && !this.submitted;
  }

  @HostListener('window:beforeunload')
  hasUnsavedDataBeforeUnload(): any {
    // Return false when there is unsaved data to show a dialog
    return !this.hasUnsavedData();
  }

  cancel() {
    this._location.back();
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

  get form() {
    return this.createSurveyEventForm;
  }
}

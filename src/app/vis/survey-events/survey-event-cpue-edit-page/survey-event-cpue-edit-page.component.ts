import {Component, OnInit} from '@angular/core';
import {HasUnsavedData} from '../../../core/core.interface';
import {Role} from '../../../core/_models/role';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {Location} from '@angular/common';
import {map, take} from 'rxjs/operators';
import {Method} from '../../../domain/method/method';

@Component({
  selector: 'app-survey-event-cpue-edit-page',
  templateUrl: './survey-event-cpue-edit-page.component.html'
})
export class SurveyEventCpueEditPageComponent implements OnInit, HasUnsavedData {

  public role = Role;

  surveyEventForm: FormGroup = new FormGroup({});
  submitted = false;
  surveyEvent: SurveyEventOverview;

  locations: SearchableSelectOption[] = [];
  methods: SearchableSelectOption[] = [];

  constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
              private methodsService: MethodsService, private _location: Location, private surveyEventsService: SurveyEventsService) {
  }

  private projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

  private surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;

  ngOnInit(): void {
    const parameters$ = this.surveyEventsService.surveyEventParameters(
      this.projectCode,
      this.surveyEventId
    );

    parameters$.subscribe(dto => {
      this.surveyEventForm = new FormGroup({});

      for (const parameter of dto.parameters) {
        this.surveyEventForm.addControl(parameter.key, new FormControl({value: parameter.value, disabled: parameter.automatic}));
      }
    });

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

    console.log(formData);

    this.surveyEventService.updateCpueParameters(this.projectCode, this.surveyEventId, formData)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['projecten', this.projectCode, 'waarnemingen', this.surveyEventId, 'cpue']).then();
      });
  }

  hasUnsavedData(): boolean {
    return this.surveyEventForm.dirty && !this.submitted;
  }

  cancel() {
    this._location.back();
  }

  controls() {
    return Object.keys(this.surveyEventForm?.controls);
  }
}


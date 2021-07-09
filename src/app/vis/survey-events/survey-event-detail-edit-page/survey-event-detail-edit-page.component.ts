import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyEventsService} from "../../../services/vis.surveyevents.service";
import {Option} from "../../../shared-ui/searchable-select/option";
import {Subject} from "rxjs";
import {map, take} from "rxjs/operators";
import {LocationsService} from "../../../services/vis.locations.service";

@Component({
  selector: 'app-survey-event-detail-edit-page',
  templateUrl: './survey-event-detail-edit-page.component.html'
})
export class SurveyEventDetailEditPageComponent implements OnInit {

  surveyEventForm: FormGroup;
  submitted = false;
  locations$ = new Subject<Option[]>();

  constructor(private titleService: Title, private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService) {
  }

  ngOnInit(): void {
    this.surveyEventForm = this.formBuilder.group(
      {
        occurrenceDate: [null, [Validators.required]],
        location: [null, [Validators.required]],
        comment: ['', Validators.maxLength(800)]
      });

    this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(surveyEvent => {
        console.log(surveyEvent);
        this.occurrenceDate.patchValue(surveyEvent.occurrence);
        this.location.patchValue({
          id: surveyEvent.fishingPoint?.id,
          translateKey: `fishing-point.id.${surveyEvent.fishingPoint?.id}.code`,
          secondaryTranslateKey: `fishing-point.id.${surveyEvent.fishingPoint?.id}`
        });
        this.comment.patchValue(surveyEvent.comment);
      })
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

  saveSurveyEvent() {
    this.submitted = true;

    if (this.surveyEventForm.invalid) {
      return;
    }

    const formData = this.surveyEventForm.getRawValue();
    formData.fishingPointId = formData.location.id;
    delete formData.location;

    console.log(formData);

    this.surveyEventService.updateSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId, formData)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
          '/waarnemingen', this.activatedRoute.parent.snapshot.params.surveyEventId]).then();
      })
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

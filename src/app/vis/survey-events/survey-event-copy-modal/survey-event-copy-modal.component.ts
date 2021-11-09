import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DatepickerComponent} from '../../../shared-ui/datepicker/datepicker.component';
import {uniqueNewValidator, uniqueValidator} from '../survey-event-validators';

@Component({
  selector: 'app-survey-event-copy-modal',
  templateUrl: './survey-event-copy-modal.component.html'
})
export class SurveyEventCopyModalComponent implements OnInit, AfterViewInit {

  isOpen = false;
  copySurveyEventForm: FormGroup;
  submitted = false;

  @ViewChild('occurrenceDatePicker') occurrenceDatePicker: DatepickerComponent;

  @Input() projectCode;
  @Input() surveyEventId;
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() location: number;
  @Input() method: string;

  constructor(private formBuilder: FormBuilder, private surveyEventsService: SurveyEventsService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.projectCode || !this.surveyEventId) {
      throw new Error('Attributes "projectCode" and "surveyEventId" are required');
    }

    this.copySurveyEventForm = this.formBuilder.group(
      {
        occurrenceDate: [null, [Validators.required]],
      }, {asyncValidators: [uniqueNewValidator(this.projectCode, this.location, this.method,  this.surveyEventsService)]});
  }

  ngAfterViewInit(): void {
    this.occurrenceDatePicker.setMinDate(new Date(this.startDate));
    if (this.endDate) {
      this.occurrenceDatePicker.setMaxDate(new Date(this.endDate));
    }
  }

  open() {
    this.isOpen = true;
  }

  get occurrenceDate() {
    return this.copySurveyEventForm.get('occurrenceDate');
  }

  copySurveyEvent() {
    this.submitted = true;

    if (this.copySurveyEventForm.invalid) {
      return;
    }

    this.surveyEventsService.copySurveyEvent(this.projectCode, this.surveyEventId, this.copySurveyEventForm.getRawValue())
      .pipe(take(1))
      .subscribe((surveyEvent) => {
        this.isOpen = false;
        this.router.navigate(['projecten', this.projectCode,
          'waarnemingen', surveyEvent.surveyEventId]).then(() => window.location.reload());
      });
  }
}

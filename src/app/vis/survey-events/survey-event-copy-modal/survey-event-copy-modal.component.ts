import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-survey-event-copy-modal',
  templateUrl: './survey-event-copy-modal.component.html'
})
export class SurveyEventCopyModalComponent implements OnInit {

  isOpen = false;
  copySurveyEventForm: FormGroup;
  submitted = false;

  @Input() projectCode;
  @Input() surveyEventId;

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
      });
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

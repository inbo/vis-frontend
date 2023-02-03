import {Component, Input, OnInit} from '@angular/core';
import {SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';

@Component({
  selector: 'vis-survey-event-status-pill',
  templateUrl: './survey-event-status-pill.component.html'
})
export class SurveyEventStatusPillComponent implements OnInit {

  @Input() surveyEvent: SurveyEventOverview;

  constructor() {
  }

  ngOnInit(): void {
  }

  public colorClasses() {
    switch (this.surveyEvent?.status) {
      case 'DELETED' :
        return 'bg-red-100 text-red-800';
      case 'ENTERED' :
        return 'bg-gray-100 text-gray-800';
      case 'VALID' :
        return 'bg-green-100 text-green-800';
    }
  }
}

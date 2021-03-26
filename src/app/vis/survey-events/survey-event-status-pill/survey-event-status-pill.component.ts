import {Component, Input, OnInit} from '@angular/core';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';

@Component({
  selector: 'app-survey-event-status-pill',
  templateUrl: './survey-event-status-pill.component.html'
})
export class SurveyEventStatusPillComponent implements OnInit {

  @Input() surveyEvent: SurveyEvent;

  constructor() {
  }

  ngOnInit(): void {
  }

  public colorClasses() {
    switch (this.surveyEvent.status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800';
      case 'DELETED' :
        return 'bg-red-100 text-red-800';
      case 'ASSIGNED' :
        return 'bg-yellow-100 text-yellow-800';
      case 'ENTERED' :
        return 'bg-gray-100 text-gray-800';
      case 'INVALID' :
        return 'bg-red-100 text-red-800';
      case 'NEW' :
        return 'bg-gray-100 text-gray-800';
      case 'PLANNED' :
        return 'bg-yellow-100 text-yellow-800';
      case 'VALID' :
        return 'bg-green-100 text-green-800';
    }
  }
}

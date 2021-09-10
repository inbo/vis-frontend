import {Component, Input, OnInit} from '@angular/core';
import {faTimesCircle, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import {ImportProjectDetail, ImportSurveyEvent} from '../../../../domain/imports/imports';

@Component({
  selector: 'app-imports-detail-survey-event',
  templateUrl: './imports-detail-survey-event.component.html'
})
export class ImportsDetailSurveyEventComponent implements OnInit {
  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faMinus = faMinus;

  showMeasurements = false;

  @Input() importOverview: ImportProjectDetail;
  @Input() surveyEvent: ImportSurveyEvent;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleShowMeasurements() {
    this.showMeasurements = !this.showMeasurements;
  }

}

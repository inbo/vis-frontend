import {Component, Input} from '@angular/core';
import {faExclamation, faMinus, faPlus, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {ImportProjectDetail, ImportSurveyEvent} from '../../../../domain/imports/imports';

@Component({
  selector: 'vis-imports-detail-survey-event',
  templateUrl: './imports-detail-survey-event.component.html',
})
export class ImportsDetailSurveyEventComponent {
  @Input() importOverview: ImportProjectDetail;

  @Input() set surveyEvent(value: ImportSurveyEvent) {
    this._surveyEvent = value;
    const invalidMeasurement = value.measurements?.find(measurement => !measurement.valid);
    if (invalidMeasurement) {
      this.hasInvalidMeasurement = true;
    } else {
      this.hasInvalidMeasurement = false;
    }
  }

  get surveyEvent(): ImportSurveyEvent {
    return this._surveyEvent;
  }

  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faMinus = faMinus;
  faExclamation = faExclamation;
  showMeasurements = false;
  hasInvalidMeasurement = false;

  private _surveyEvent: ImportSurveyEvent;

  toggleShowMeasurements() {
    this.showMeasurements = !this.showMeasurements;
  }
}

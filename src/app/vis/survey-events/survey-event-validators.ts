import {AsyncValidatorFn, UntypedFormGroup, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurveyEventsService} from '../../services/vis.surveyevents.service';
import {isValid} from 'date-fns';

export function uniqueNewValidator(
    projectId: number,
    surveyEventService: SurveyEventsService,
    surveyEventId?: number): AsyncValidatorFn {
    return (form: UntypedFormGroup): Observable<ValidationErrors | null> => {
        const method = form.get('method').value;
        const occurrenceDate = new Date(form.get('occurrenceDate').value);
        const fishingPoint = form.get('fishingPointId').value;

        if (!method || !isValid(occurrenceDate) || !projectId || !fishingPoint) {
            return of({uniqueSurveyEvent: false});
        }
        return surveyEventService
            .isSurveyEventUnique(
                projectId,
                occurrenceDate,
                method,
                fishingPoint,
                surveyEventId,
            )
            .pipe(
                map(result => result.valid ? null : {uniqueSurveyEvent: false}),
            );
    };
}

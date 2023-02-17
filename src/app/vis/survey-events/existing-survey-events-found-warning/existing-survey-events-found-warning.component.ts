import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {startOfDay} from 'date-fns';
import {forkJoin, of, Subject} from 'rxjs';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Project} from '../../../domain/project/project';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {isEqual, isNil} from 'lodash-es';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
    selector: 'vis-existing-survey-events-found-warning',
    templateUrl: 'existing-survey-events-found-warning.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingSurveyEventsFoundWarningComponent implements OnChanges, OnInit {

    private readonly changeSubject: Subject<{ method: string, fishingPointId: number, date: Date }> = new Subject<{ method: string, fishingPointId: number, date: Date }>();

    @Input() method: string;
    @Input() fishingPointId: number;
    @Input() date: Date;

    existingSurveyEventsWithFishingPointMethodAndOccurrenceDate: { surveyEvent: SurveyEvent; project: Array<SurveyEvent> | Project }[];

    constructor(private surveyEventsService: SurveyEventsService,
                private projectService: ProjectService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.changeSubject.next({
            method: this.method,
            fishingPointId: this.fishingPointId,
            date: startOfDay(this.date),
        });
    }

    ngOnInit(): void {
        this.changeSubject
            .pipe(
                filter(() => this.method && !isNil(this.fishingPointId) && !!this.date),
                debounceTime(500),
                distinctUntilChanged(isEqual.bind(this)),
                switchMap((value) => this.surveyEventsService.searchSurveyEvents(value.fishingPointId, value.method, value.date)),
                switchMap(foundSurveyEvents => forkJoin([of(foundSurveyEvents), ...foundSurveyEvents.map(event => this.projectService.getProjectCached(event.projectCode))])),
            ).subscribe(
            ([foundSurveyEvents, ...projects]: [Array<SurveyEvent>, ...Array<Project>]) => {
                this.existingSurveyEventsWithFishingPointMethodAndOccurrenceDate = foundSurveyEvents
                    .map(surveyEvent => ({
                        surveyEvent,
                        project: projects.find(project => project.code.value === surveyEvent.projectCode),
                    }));
                this.changeDetectorRef.detectChanges();
            });
    }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../project/model/project";
import {Observable, Subscription} from "rxjs";
import {VisService} from "../../../vis.service";
import {ActivatedRoute} from "@angular/router";
import {SurveyEvent} from "../../project/model/surveyEvent";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-survey-event-heading',
  templateUrl: './survey-event-heading.component.html'
})
export class SurveyEventHeadingComponent implements OnInit, OnDestroy {

  project: Project;

  private subscription = new Subscription();
  surveyEvent$: Observable<SurveyEvent>;
  surveyEventMethodCode$: Observable<string>;
  surveyEventOccurrence$: Observable<Date>;

  constructor(private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.project = value;
      })
    );

    this.surveyEvent$ = this.visService.getSurveyEvent(this.activatedRoute.snapshot.params.projectCode, this.activatedRoute.snapshot.params.surveyEventId);
    this.surveyEventMethodCode$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.method), map(code => 'method.' + code));
    this.surveyEventOccurrence$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.occurrence));

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showCreateMeasurementsButton() {
    return !window.location.pathname.endsWith('metingen/toevoegen');
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../project/model/project";
import {Observable, Subscription} from "rxjs";
import {VisService} from "../../../vis.service";
import {ActivatedRoute} from "@angular/router";
import {SurveyEvent} from "../../project/model/surveyEvent";

@Component({
  selector: 'app-survey-event-heading',
  templateUrl: './survey-event-heading.component.html'
})
export class SurveyEventHeadingComponent implements OnInit, OnDestroy {

  project: Project;

  private subscription = new Subscription();
  private surveyEvent$: Observable<SurveyEvent>;

  constructor(private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.project = value;
      })
    );

    this.surveyEvent$ = this.visService.getSurveyEvent(this.activatedRoute.snapshot.params.projectCode, this.activatedRoute.snapshot.params.surveyEventId);

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

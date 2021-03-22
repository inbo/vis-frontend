import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../project/model/project";
import {Subscription} from "rxjs";
import {VisService} from "../../../vis.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-survey-event-heading',
  templateUrl: './survey-event-heading.component.html'
})
export class SurveyEventHeadingComponent implements OnInit, OnDestroy {

  project: Project;

  private subscription = new Subscription();

  constructor(private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.project = value;
      })
    );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

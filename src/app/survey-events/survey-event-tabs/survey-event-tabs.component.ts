import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyEventId} from "../../project/model/surveyEvent";

@Component({
  selector: 'survey-event-tabs',
  templateUrl: './survey-event-tabs.component.html'
})
export class SurveyEventTabsComponent implements OnInit {

  @Input() projectCode : string;
  @Input() surveyEventId : SurveyEventId;
  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUrl = "/" + this.activatedRoute.snapshot.url.join("/")
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }

}

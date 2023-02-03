import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'vis-survey-event-tabs',
  templateUrl: './survey-event-tabs.component.html'
})
export class SurveyEventTabsComponent implements OnInit {

  currentUrl: string;
  surveyEventId: any;
  projectCode: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.currentUrl = '/' + this.activatedRoute.snapshot.url.join('/');
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.projectCode = this.activatedRoute.snapshot.params.projectCode;
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }

}

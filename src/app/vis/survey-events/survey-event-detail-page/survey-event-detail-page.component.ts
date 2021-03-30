import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-survey-event-detail-page',
  templateUrl: './survey-event-detail-page.component.html'
})

export class SurveyEventDetailPageComponent implements OnInit {

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Waarneming algemeen ${this.activatedRoute.parent.snapshot.params.surveyEventId}`);
  }

  ngOnInit(): void {
  }

}

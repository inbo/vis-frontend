import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'survey-event-detail-page',
  templateUrl: './survey-event-detail-page.component.html'
})

export class SurveyEventDetailPageComponent implements OnInit {

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Waarneming algemeen ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
  }

}

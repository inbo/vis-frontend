import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-survey-event-traject-page',
  templateUrl: './survey-event-traject-page.component.html'
})
export class SurveyEventTrajectPageComponent implements OnInit {

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Waarneming traject ' + this.activatedRoute.parent.snapshot.params.surveyEventId);

  }

  ngOnInit(): void {
  }

}

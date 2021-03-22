import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-survey-event-method-page',
  templateUrl: './survey-event-method-page.component.html'
})
export class SurveyEventMethodPageComponent implements OnInit {

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Waarneming methode ' + this.activatedRoute.parent.snapshot.params.surveyEventId);

  }

  ngOnInit(): void {
  }

}

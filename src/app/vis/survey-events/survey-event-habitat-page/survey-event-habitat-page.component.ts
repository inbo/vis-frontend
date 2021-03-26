import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Habitat} from '../model/habitat';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';

@Component({
  selector: 'app-survey-event-habitat-page',
  templateUrl: './survey-event-habitat-page.component.html'
})
export class SurveyEventHabitatPageComponent implements OnInit, OnDestroy {

  projectCode: string;
  surveyEventId: any;
  habitat: Habitat;
  habitatForm: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming habitat ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.habitatForm = this.formBuilder.group(
      {
        waterLevel: [null],
        shelters: [null],
        shore: [null],
        slope: [null],
        agriculture: [null],
        meadow: [null],
        trees: [null],
        buildings: [null],
        industry: [null],
        loop: [null],
      });

    this.subscription.add(this.surveyEventsService.getHabitat(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventId)
      .subscribe(value => {
        this.habitat = value;
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

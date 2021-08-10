import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {Habitat} from '../../../domain/survey-event/habitat';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';

@Component({
  selector: 'app-survey-event-habitat-page',
  templateUrl: './survey-event-habitat-page.component.html'
})
export class SurveyEventHabitatPageComponent implements OnInit, OnDestroy {

  public role = Role;

  projectCode: string;
  surveyEventId: any;
  habitat: Habitat;
  habitatForm: FormGroup;

  surveyEvent$: Observable<SurveyEvent>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder, private surveyEventService: SurveyEventsService) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;

    this.surveyEvent$ = this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId);

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

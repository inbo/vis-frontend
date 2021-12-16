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
        current: [null],
      });

    this.subscription.add(this.surveyEventsService.getHabitat(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventId)
      .subscribe(value => {
        this.habitat = value;
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  soils() {
    const soils: string[] = [];

    if (this.habitat.soil.other) {
      soils.push('other');
    }
    if (this.habitat.soil.grint) {
      soils.push('grint');
    }
    if (this.habitat.soil.clay) {
      soils.push('clay');
    }
    if (this.habitat.soil.mudd) {
      soils.push('mudd');
    }
    if (this.habitat.soil.silt) {
      soils.push('silt');
    }
    if (this.habitat.soil.stones) {
      soils.push('stones');
    }
    if (this.habitat.soil.sand) {
      soils.push('sand');
    }
    if (this.habitat.soil.unknown) {
      soils.push('unknown');
    }

    return soils;
  }

  bottlenecks() {
    const bottlenecks: string[] = [];

    if (this.habitat.bottleneck.motorway) {
      bottlenecks.push('motorway');
    }

    if (this.habitat.bottleneck.diver) {
      bottlenecks.push('diver');
    }

    if (this.habitat.bottleneck.mill) {
      bottlenecks.push('mill');
    }

    if (this.habitat.bottleneck.undefined) {
      bottlenecks.push('undefined');
    }

    if (this.habitat.bottleneck.lock) {
      bottlenecks.push('lock');
    }

    if (this.habitat.bottleneck.reservoir) {
      bottlenecks.push('reservoir');
    }

    if (this.habitat.bottleneck.weir) {
      bottlenecks.push('weir');
    }

    if (this.habitat.bottleneck.decay) {
      bottlenecks.push('decay');
    }

    return bottlenecks;
  }

  vegetations() {
    const vegetations: string[] = [];

    if (this.habitat.vegetation.filamentousAlgae) {
      vegetations.push('filamentousAlgae');
    }
    if (this.habitat.vegetation.threadAlgae) {
      vegetations.push('threadAlgae');
    }
    if (this.habitat.vegetation.soilWaterPlants) {
      vegetations.push('soilWaterPlants');
    }

    return vegetations;
  }
}

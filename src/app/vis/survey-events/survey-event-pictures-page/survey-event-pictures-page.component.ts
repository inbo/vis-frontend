import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {PicturesService} from '../../../services/vis.pictures.service';
import {ProjectService} from '../../../services/vis.project.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'vis-survey-event-pictures-page',
  templateUrl: './survey-event-pictures-page.component.html'
})
export class SurveyEventPicturesPageComponent implements OnInit, OnDestroy {
  loading = true;

  subscription = new Subscription();
  projectCode: string;
  surveyEventId: number;
  url: string;
  tandemvaultcollectionslug: string;
  showWarning = false;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute,
              private picturesService: PicturesService, private projectService: ProjectService) {
    this.projectCode = this.activatedRoute.snapshot.parent.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.parent.params.surveyEventId;
    this.url = this.activatedRoute.snapshot.data.url;
    this.titleService.setTitle(`Waarneming afbeeldingen`);

    this.projectService.getProject(this.projectCode).subscribe(value => {
      this.tandemvaultcollectionslug = value.tandemvaultcollectionslug;
      this.loading = false;
    });

    this.showWarning = environment.env === 'local' || environment.env === 'dev' || environment.env === 'uat';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

  }

}

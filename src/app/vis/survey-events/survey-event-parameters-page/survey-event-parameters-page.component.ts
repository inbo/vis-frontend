import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';
import {Parameters} from '../../project/model/parameters';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-survey-event-parameters-page',
  templateUrl: './survey-event-parameters-page.component.html'
})
export class SurveyEventParametersPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: 'Waterkwaliteitsparameters',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/waterkwaliteitsparameters'
    }
  ];

  projectCode: string;
  surveyEventId: any;
  parameters: Parameters;

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.projectCode = this.activatedRoute.snapshot.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming waterkwaliteitsparameters ' + this.activatedRoute.snapshot.params.surveyEventId);

    this.subscription.add(this.visService.getParameters(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.snapshot.params.surveyEventId).subscribe(value => {
      this.parameters = value;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

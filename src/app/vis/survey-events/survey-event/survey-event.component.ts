import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-survey-event',
  templateUrl: './survey-event.component.html'
})
export class SurveyEventComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: 'ID: ' + this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: '',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/waterkwaliteitsparameters'
    }
  ];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      let name = this.activatedRoute.snapshot.firstChild.data.name;
      let url = this.activatedRoute.snapshot.firstChild.data.url;
      this.breadcrumbLinks[this.breadcrumbLinks.length - 1] = {
        title: name,
        url: `/projecten/${this.activatedRoute.snapshot.params.projectCode}/waarnemingen/${this.activatedRoute.snapshot.params.surveyEventId}/${url}`
      }
    });
  }

}

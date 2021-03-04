import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../project/model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../../vis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Parameters} from "../../project/model/parameters";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HasUnsavedData} from "../../../core/core.interface";

@Component({
  selector: 'app-survey-event-parameters-page',
  templateUrl: './survey-event-parameters-page.component.html'
})
export class SurveyEventParametersPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {title: this.activatedRoute.snapshot.params.surveyEventId, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.surveyEventId},
    {title: 'Parameters', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.surveyEventId + '/parameters'}
  ]

  project: Project;
  surveyEventId: any;
  parameters: Parameters;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming parameters ' + this.activatedRoute.snapshot.params.surveyEventId)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
      this.project = value
    });

    this.visService.getParameters(this.activatedRoute.snapshot.params.projectCode, this.activatedRoute.snapshot.params.surveyEventId)
      .subscribe(value => {
        this.parameters = value;
      })

  }

  ngOnInit(): void {
  }

}

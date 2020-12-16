import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../project/model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-observation-traject-page',
  templateUrl: './observation-traject-page.component.html'
})
export class ObservationTrajectPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {title: this.activatedRoute.snapshot.params.observationId, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId},
    {title: 'Traject', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId + '/traject'}
  ]

  project: Project;
  observationId: any;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.observationId = this.activatedRoute.snapshot.params.observationId;
    this.titleService.setTitle('Waarneming traject ' + this.activatedRoute.snapshot.params.observationId)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
      this.project = value
    })

  }

  ngOnInit(): void {
  }

}

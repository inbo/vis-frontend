import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../project/model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute} from "@angular/router";
import {Parameters} from "../../project/model/parameters";

@Component({
  selector: 'app-observation-parameters-page',
  templateUrl: './observation-parameters-page.component.html'
})
export class ObservationParametersPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {title: this.activatedRoute.snapshot.params.observationId, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId},
    {title: 'Parameters', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId + '/parameters'}
  ]

  project: Project;
  observationId: any;
  parameters: Parameters;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.observationId = this.activatedRoute.snapshot.params.observationId;
    this.titleService.setTitle('Waarneming parameters ' + this.activatedRoute.snapshot.params.observationId)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
      this.project = value
    });

    this.visService.getParameters(this.activatedRoute.snapshot.params.projectCode, this.activatedRoute.snapshot.params.observationId)
      .subscribe(value => {
        console.log(value);
        this.parameters = value;
      })

  }

  ngOnInit(): void {
  }

}

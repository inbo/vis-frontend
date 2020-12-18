import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../project/model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute} from "@angular/router";
import {AsyncPage} from "../../shared-ui/paging-async/asyncPage";
import {Measurement} from "../../project/model/measurement";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-observation-measurements-page',
  templateUrl: './observation-measurements-page.component.html'
})
export class ObservationMeasurementsPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {title: this.activatedRoute.snapshot.params.observationId, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId},
    {title: 'Metingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.observationId + '/metingen'}
  ]

  project: Project;

  projectCode: any;
  observationId: any;

  loading: boolean = false;
  pager: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.observationId = this.activatedRoute.snapshot.params.observationId;
    this.projectCode = this.activatedRoute.snapshot.params.projectCode
    this.titleService.setTitle('Waarneming metingen ' + this.activatedRoute.snapshot.params.observationId)
    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
      this.project = value
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loadMeasurements(params.page ? params.page : 1, params.size ? params.size : 20)
    });
  }

  loadMeasurements(page: number, size: number) {
    this.loading = true;
    this.measurements = of([])
    this.visService.getMeasurements(this.projectCode, this.observationId, page, size).subscribe((value) => {
      this.pager = value;
      this.measurements = of(value.content);
      this.loading = false;
    });
  }

}

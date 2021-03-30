import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../../domain/project/project';
import {Subscription} from 'rxjs';
import {Role} from '../../../core/_models/role';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html'
})
export class ProjectDetailPageComponent implements OnInit, OnDestroy {
  public role = Role;
  project: Project;

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.titleService.setTitle(`${value.name} detail`);
        this.project = value;
      })
    );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exportProject() {
    this.projectService.exportProject(this.activatedRoute.snapshot.params.projectCode);
  }
}

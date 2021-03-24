import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../model/project';
import {Subscription} from 'rxjs';
import {Role} from "../../../core/_models/role";

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html'
})
export class ProjectDetailPageComponent implements OnInit, OnDestroy {
  public role = Role;
  project: Project;

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
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
    this.visService.exportProject(this.activatedRoute.snapshot.params.projectCode);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-heading',
  templateUrl: './project-heading.component.html'
})
export class ProjectHeadingComponent implements OnInit, OnDestroy {

  project$ = this.projectService.project$;

  private subscription = new Subscription();

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.projectService.next(value);
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

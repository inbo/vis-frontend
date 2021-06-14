import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../services/vis.project.service';
import {ProjectFavorites} from '../../../domain/settings/project-favorite';

@Component({
  selector: 'app-project-heading',
  templateUrl: './project-heading.component.html'
})
export class ProjectHeadingComponent implements OnInit, OnDestroy {

  project$ = this.projectService.project$;

  private subscription = new Subscription();
  private settings: ProjectFavorites;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.projectService.next(value);
      })
    );

    this.subscription.add(
      this.projectService.projectFavorites().subscribe(value => {
        this.settings = value;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleFavorite() {
    this.subscription.add(
      this.projectService.toggleFavorite(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.subscription.add(
          this.projectService.projectFavorites().subscribe(settings => {
            this.settings = settings;
          })
        );
      })
    );
  }

  isFavorite(value: string) {
    return this.settings?.favorites.indexOf(value) >= 0;
  }
}

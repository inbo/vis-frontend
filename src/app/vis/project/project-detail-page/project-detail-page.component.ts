import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../../domain/project/project';
import {Subscription} from 'rxjs';
import {Role} from '../../../core/_models/role';
import {ProjectService} from '../../../services/vis.project.service';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-project-detail-page',
    templateUrl: './project-detail-page.component.html',
})
export class ProjectDetailPageComponent implements OnInit, OnDestroy {

    role = Role;
    project: Project;

    private subscription = new Subscription();

    constructor(private titleService: Title,
                private projectService: ProjectService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode)
                .pipe(take(1))
                .subscribe(value => {
                    this.titleService.setTitle(`${value.name} detail`);
                    this.project = value;
                }),
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    exportProject() {
        this.projectService.exportProject(this.activatedRoute.snapshot.params.projectCode)
            .pipe(take(1))
            .subscribe(res => {
                this.projectService.downloadFile(res);
            });
    }

    reOpenProject() {
        this.subscription.add(this.projectService.reOpenProject(this.activatedRoute.snapshot.params.projectCode)
            .subscribe(value => {
                this.projectService.next(value);
                this.project = value;
            }));
    }

}

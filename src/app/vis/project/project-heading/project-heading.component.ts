import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../../services/vis.project.service';
import {ProjectFavorites} from '../../../domain/settings/project-favorite';
import {Project} from '../../../domain/project/project';
import {ImportsService} from '../../../services/vis.imports.service';
import {AlertService} from '../../../_alert';
import {Role} from '../../../core/_models/role';

@Component({
    selector: 'app-project-heading',
    templateUrl: './project-heading.component.html',
})
export class ProjectHeadingComponent implements OnInit, OnDestroy {

    role = Role;
    project$: Observable<Project> = this.projectService.project$;

    private subscription = new Subscription();
    private settings: ProjectFavorites;
    isImporting = false;

    constructor(private projectService: ProjectService,
                private activatedRoute: ActivatedRoute,
                private importsService: ImportsService,
                private router: Router,
                private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this.projectService
                .getProject(this.activatedRoute.snapshot.params.projectCode)
                .subscribe(value => {
                    this.projectService.next(value);
                }),
        );

        this.subscription.add(
            this.projectService.projectFavorites().subscribe(value => {
                this.settings = value;
            }),
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
                    }),
                );
            }),
        );
    }

    isFavorite(projectId: number) {
        return this.settings?.favorites.indexOf(projectId) >= 0;
    }

    showCreateSurveyEventButton() {
        return !window.location.pathname.endsWith('waarnemingen/toevoegen');
    }

    createImportFile() {
        this.isImporting = true;
        this.importsService.createFile(this.activatedRoute.snapshot.params.projectCode)
            .subscribe(value => {
                this.isImporting = false;
                this.alertService.success('Spreadsheet aangemaakt', 'Bewerk de aangemaakte spreadsheet <a class="underline" href="/importeren/' + value.spreadsheetId + '">hier</a>.', false);
            });
    }
}

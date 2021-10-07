import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ServerAlertService} from '../../services/vis.server.alert.service';
import {Observable, Subscription} from 'rxjs';
import {ServerAlert} from '../../domain/alert/server.alert';
import {ProjectService} from '../../services/vis.project.service';
import {Project} from '../../domain/project/project';
import {AuthService} from '../../core/auth.service';
import {SurveyEventsService} from '../../services/vis.surveyevents.service';
import {SurveyEventOverview} from '../../domain/survey-event/surveyEvent';
import {AsyncPage} from '../../shared-ui/paging-async/asyncPage';
import {Role} from '../../core/_models/role';
import {ClipboardService} from 'ngx-clipboard';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public role = Role;

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Home', url: '/dashboard'},
  ];

  alerts$: Observable<ServerAlert[]>;
  favoriteProjects$: Observable<Project[]>;
  lastSurveyEvents$: Observable<AsyncPage<SurveyEventOverview>>;
  recentProjects$: Observable<AsyncPage<Project>>;

  private subscription = new Subscription();

  constructor(public authService: AuthService, private titleService: Title, private serverAlertService: ServerAlertService,
              private projectService: ProjectService, private surveyEventsService: SurveyEventsService,
              private clipboardService: ClipboardService, private route: ActivatedRoute) {
    this.titleService.setTitle('V.I.S. Dashboard');
    this.alerts$ = this.serverAlertService.getCurrentAlerts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.favoriteProjects$ = this.projectService.projectFavoritesOverview();
    this.recentProjects$ = this.projectService.getProjects(0, 5, {sort: 'createDate,DESC'});
    this.lastSurveyEvents$ = this.surveyEventsService.getAllSurveyEvents(0, 5, {my: true});
  }

  public get fullName() {
    return this.authService.fullName;
  }

  public get username() {
    return this.authService.username;
  }

  public get picture() {
    return this.authService.picture;
  }

  public get email() {
    return this.authService.email;
  }

  greeting() {
    const hours = new Date().getHours();
    if (hours < 6) {
      return 'Goede nacht';
    } else if (hours < 12) {
      return 'Goedemorgen';
    } else if (hours < 18) {
      return 'Goede middag';
    } else {
      return 'Goede avond';
    }
  }

  toggleFavorite(value: any) {
    this.subscription.add(
      this.projectService.toggleFavorite(value).subscribe(value1 => {
        this.favoriteProjects$ = this.projectService.projectFavoritesOverview();
      })
    );

  }

  copyLinkToClipboard(projectCode: string) {
    const url = `${window.location.origin}/projecten/${projectCode}`;
    this.clipboardService.copy(url);
  }
}

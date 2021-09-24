import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Project} from '../../../domain/project/project';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProjectAddComponent} from '../project-add/project-add.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Role} from '../../../core/_models/role';
import {debounceTime, distinctUntilChanged, take} from 'rxjs/operators';
import {ProjectService} from '../../../services/vis.project.service';
import {AuthService} from '../../../core/auth.service';
import _ from 'lodash';
import {AccountService} from '../../../services/vis.account.service';
import {Team} from '../../../domain/account/team';

@Component({
  selector: 'app-projects-overview-page',
  templateUrl: './projects-overview-page.component.html'
})
export class ProjectsOverviewPageComponent implements OnInit {
  @ViewChild(ProjectAddComponent) projectAddComponent;

  role = Role;

  loading = false;
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'}
  ];

  pager: AsyncPage<Project>;
  projects: Observable<Project[]>;

  filterForm: FormGroup;
  advancedFilterIsVisible = false;

  teams$: Observable<Team[]>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, public authService: AuthService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Projecten');

    this.teams$ = this.accountService.listTeams();

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        name: [queryParams.name ?? null],
        description: [queryParams.description ?? null],
        lengthType: [queryParams.lengthType ?? null],
        status: [queryParams.status ?? null],
        team: [queryParams.team ?? null],
        sort: [queryParams.sort ?? null],
        page: [queryParams.page ?? null],
        size: [queryParams.size ?? null]
      },
    );

    this.subscription.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => {
          const filteredObj = (obj) =>
            Object.entries(obj)
              .filter(([, value]) => !!value || typeof value === 'boolean')
              .reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

          return _.isEqual(filteredObj(a), filteredObj(b));
        })
      ).subscribe(() => this.filter())
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('name').patchValue(params.name ? params.name : null);
        this.filterForm.get('description').patchValue(params.description ? params.description : null);
        this.filterForm.get('lengthType').patchValue(params.lengthType ? params.lengthType : null);
        this.filterForm.get('status').patchValue(params.status ? params.status : null);
        this.filterForm.get('team').patchValue(params.team ? params.team : null);
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : null);
        this.filterForm.get('page').patchValue(params.page ? params.page : null);
        this.filterForm.get('size').patchValue(params.size ? params.size : null);

        this.advancedFilterIsVisible = ((params.description !== undefined && params.description !== '') ||
          (params.lengthType !== undefined && params.lengthType !== ''));
      })
    );
  }

  getProjects() {
    this.loading = true;
    this.projects = of([]);
    const page = this.filterForm.get('page').value ?? 0;
    const size = this.filterForm.get('size').value ?? 20;
    this.subscription.add(
      this.projectService.getProjects(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        this.projects = of(value.content);
        this.loading = false;
      })
    );
  }

  openAddProject() {
    this.projectAddComponent.open();
  }

  filter() {
    const rawValue = this.filterForm.getRawValue();
    const queryParams: Params = {...rawValue};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();

    this.getProjects();
  }

  exportProjects() {
    this.projectService.exportProjects(this.filterForm.getRawValue())
      .pipe(take(1))
      .subscribe(res => {
        this.projectService.downloadFile(res);
      });
  }
}

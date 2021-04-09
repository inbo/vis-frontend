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
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ProjectService} from '../../../services/vis.project.service';

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

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Projecten');

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        name: [queryParams.name],
        description: [queryParams.description],
        status: [queryParams.status],
        sort: [queryParams.sort ?? '']
      },
    );

    this.subscription.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
        .subscribe(_ => this.filter())
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('name').patchValue(params.name ? params.name : '');
        this.filterForm.get('description').patchValue(params.description ? params.description : '');
        this.filterForm.get('status').patchValue(params.status ? params.status : '');
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');

        this.advancedFilterIsVisible = (params.description !== undefined && params.description !== '');
      })
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getProjects(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  getProjects(page: number, size: number) {
    this.loading = true;
    this.projects = of([]);
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
    const queryParams: Params = {...rawValue, page: 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      }).then();

    this.getProjects(1, 20);
  }

  exportProjects() {
    this.projectService.exportProjects(this.filterForm.getRawValue());
  }
}

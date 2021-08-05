import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HasUnsavedData} from '../../../core/core.interface';
import {Observable, Subscription} from 'rxjs';
import {ProjectService} from '../../../services/vis.project.service';
import {Role} from '../../../core/_models/role';
import {AccountService} from '../../../services/vis.account.service';
import {map} from 'rxjs/operators';
import {MultiSelectOption} from '../../../shared-ui/multi-select/multi-select';
import {Location} from '@angular/common';

@Component({
  selector: 'app-project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {
  public role = Role;

  closeProjectForm: FormGroup;
  projectForm: FormGroup;
  project: Project;
  submitted: boolean;
  closeProjectFormSubmitted: boolean;

  showCloseProjectModal = false;

  teams$: Observable<MultiSelectOption[]>;
  instances$: Observable<MultiSelectOption[]>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private accountService: AccountService,
              private _location: Location) {

  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(map(values => values.map(value => {
      return {value: value.code, displayValue: value.code};
    })));

    this.teams$ = this.accountService.listTeams().pipe(map(values => values.map(value => {
      return {value: value.name, displayValue: value.name};
    })));

    this.closeProjectForm = this.formBuilder.group({
      endDate: [null, [Validators.required]]
    });

    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        lengthType: ['', [Validators.required]],
        startDate: [null, [Validators.required]],
        teams: [[]],
        instances: [[]],
      });

    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode).subscribe((value: Project) => {
        this.titleService.setTitle(value.name);
        this.project = value;
        this.projectForm.get('name').patchValue(value.name);
        this.projectForm.get('description').patchValue(value.description);
        this.projectForm.get('startDate').patchValue(new Date(value.start));
        this.projectForm.get('lengthType').patchValue(value.lengthType);
        this.projectForm.get('teams').patchValue(value.teams === undefined ? [] : value.teams);
        this.projectForm.get('instances').patchValue(value.instances === undefined ? [] : value.instances);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  saveProject() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }

    const formData = this.projectForm.getRawValue();

    this.subscription.add(
      this.projectService.updateProject(this.project.code.value, formData).subscribe(
        (response) => {
          this.project = response;
          this.projectForm.reset();
          this.projectService.next(response);
          this.router.navigate(['/projecten', this.project.code.value]).then();
        },
        (error) => console.log(error)
      )
    );
  }

  cancel() {
    this._location.back();
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.projectForm.dirty) {
      $event.returnValue = true;
    }
  }

  closeProject() {
    this.closeProjectFormSubmitted = true;

    if (this.closeProjectForm.invalid) {
      return;
    }

    this.subscription.add(this.projectService.closeProject(this.activatedRoute.parent.snapshot.params.projectCode,
      this.closeProjectForm.getRawValue()).subscribe(value => {
        this.projectService.next(value);
        this.router.navigateByUrl(`/projecten/${this.activatedRoute.parent.snapshot.params.projectCode}`);
      }
      )
    );
  }

  hasUnsavedData(): boolean {
    return this.projectForm.dirty && !this.submitted;
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.closeProjectForm.get('endDate');
  }

  get lengthType() {
    return this.projectForm.get('lengthType');
  }

  get teams() {
    return this.projectForm.get('teams');
  }

  get instances() {
    return this.projectForm.get('instances');
  }
}

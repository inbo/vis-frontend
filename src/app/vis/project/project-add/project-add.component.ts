import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {ProjectService} from '../../../services/vis.project.service';
import {AccountService} from '../../../services/vis.account.service';
import {MultiSelectOption} from '../../../shared-ui/multi-select/multi-select';
import {ProjectTeam} from '../../../domain/project/project';
import {ProjectTeamFormSyncService} from '../../../services/forms/project-team-form-sync.service';
import {instanceToSelectOption, teamToProjectTeamSelectOption} from '../../../shared-ui/utils/select-options.util';

@Component({
  selector: 'vis-project-add',
  templateUrl: './project-add.component.html'
})
export class ProjectAddComponent implements OnInit, OnDestroy {

  teams$: Observable<MultiSelectOption[]>;
  instances$: Observable<MultiSelectOption[]>;

  createProjectForm: UntypedFormGroup;
  isOpen = false;

  submitted: boolean;

  private subscription = new Subscription();

  constructor(private projectService: ProjectService, private formBuilder: UntypedFormBuilder, private router: Router,
              private accountService: AccountService,
              private projectTeamFormSyncService: ProjectTeamFormSyncService) {
  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(
        take(1),
        map(values => values.map(instanceToSelectOption))
    );

    this.teams$ = this.accountService.listTeams().pipe(
        take(1),
        map(values => values.map(teamToProjectTeamSelectOption))
    );

    this.createProjectForm = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(30)], [this.codeValidator()]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      lengthType: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      contact: [''],
      teams: [[]],
      instances: [[], [Validators.required]]
    });

    this.projectTeamFormSyncService.syncTeamsAndInstances(
        this.createProjectForm.get('teams') as FormControl<ProjectTeam[]>,
        this.createProjectForm.get('instances') as FormControl<string[]>,
        this.subscription
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  open() {
    this.isOpen = true;
  }

  createProject() {
    this.submitted = true;

    if (this.createProjectForm.invalid) {
      return;
    }

    const formData = this.createProjectForm.getRawValue();

    this.subscription.add(
      this.projectService.createProject(formData).subscribe(
        () => {
          this.isOpen = false;
          this.router.navigateByUrl('/projecten/' + formData.code);
        }
      )
    );
  }

  cancel() {
    this.isOpen = false;
    this.submitted = false;
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.projectService.checkIfProjectExists(control.value)
        .pipe(map(result => result.valid ? {uniqueCode: true} : null));
    };
  }

  get code() {
    return this.createProjectForm.get('code');
  }

  get name() {
    return this.createProjectForm.get('name');
  }

  get description() {
    return this.createProjectForm.get('description');
  }

  get startDate() {
    return this.createProjectForm.get('startDate');
  }

  get lengthType() {
    return this.createProjectForm.get('lengthType');
  }

  get teams() {
    return this.createProjectForm.get('teams');
  }

  get instances() {
    return this.createProjectForm.get('instances');
  }
}

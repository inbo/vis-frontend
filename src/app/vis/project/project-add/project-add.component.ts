import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProjectService} from '../../../services/vis.project.service';
import {AccountService} from '../../../services/vis.account.service';
import {MultiSelectOption} from '../../../shared-ui/multi-select/multi-select';

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
              private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(map(values => values.map(value => {
      return {value: value.code, displayValue: value.code};
    })));

    this.teams$ = this.accountService.listTeams().pipe(map(values => values.map(value => {
      return {value: value.name, displayValue: value.name};
    })));

    this.createProjectForm = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(15)], [this.codeValidator()]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      lengthType: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      contact: [''],
      teams: [[]],
      instances: [[]]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

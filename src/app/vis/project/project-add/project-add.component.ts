import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html'
})
export class ProjectAddComponent implements OnInit, OnDestroy {

  createProjectForm: FormGroup;
  isOpen = false;

  submitted: boolean;

  private subscription = new Subscription();

  constructor(private projectService: ProjectService, private formBuilder: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    this.createProjectForm = this.formBuilder.group({
      code: [null, [Validators.required, Validators.maxLength(15)], [this.codeValidator()]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      lengthType: ['', [Validators.required]],
      status: [true, []],
      startDate: [null, [Validators.required]],
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
        (response) => {
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
        .pipe(map(result => result.valid ? {unique: true} : null));
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

  get status() {
    return this.createProjectForm.get('status');
  }

  get startDate() {
    return this.createProjectForm.get('startDate');
  }

  get lengthType() {
    return this.createProjectForm.get('lengthType');
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ProjectService} from '../../../services/vis.project.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {MethodsService} from '../../../services/vis.methods.service';
import {CpueService} from '../../../services/vis.cpue.service';
import {Method} from '../../../domain/method/method';

@Component({
  selector: 'app-method-edit',
  templateUrl: './method-edit.component.html'
})
export class MethodEditComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  isOpen = false;

  submitted: boolean;

  private methodCode: string;
  private subscription = new Subscription();

  method: Method;
  allParameters: string[];

  constructor(private projectService: ProjectService, private formBuilder: FormBuilder, private router: Router,
              private methodsService: MethodsService, private cpueService: CpueService) {

  }

  ngOnInit(): void {

    this.cpueService.listAllParameters().subscribe(value => this.allParameters = value);
    this.editForm = this.formBuilder.group({
      description: ['', [Validators.maxLength(50)]],
      parameters: this.formBuilder.array([])
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.editForm.get('parameters') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public open(methodCode: string) {
    this.methodCode = methodCode;
    const method$ = this.methodsService.getMethod(methodCode);
    const cpue$ = this.cpueService.cpueParametersByMethodCode(methodCode);

    this.isOpen = true;

    forkJoin([method$, cpue$]).subscribe(([method, parameters]) => {
      this.method = method;

      const params = parameters.map(value => new FormControl(value));
      this.editForm = this.formBuilder.group({
        description: [this.method.description, [Validators.required, Validators.maxLength(50)]],
        parameters: new FormArray(params)
      });

    });
  }

  saveMethod() {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    const formData = this.editForm.getRawValue();

    this.subscription.add(
      this.methodsService.updateMethod(formData, this.methodCode).subscribe(
        () => {
          this.isOpen = false;
          this.router.navigateByUrl('/methoden');
        }
      )
    );
  }

  cancel() {
    this.isOpen = false;
    this.submitted = false;
  }

  // TODO do same for instance code
  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.projectService.checkIfProjectExists(control.value)
        .pipe(map(result => result.valid ? {uniqueCode: true} : null));
    };
  }

  get code() {
    return this.editForm.get('code');
  }

  get name() {
    return this.editForm.get('name');
  }

  get description() {
    return this.editForm.get('description');
  }

  get startDate() {
    return this.editForm.get('startDate');
  }

  get lengthType() {
    return this.editForm.get('lengthType');
  }

  get teams() {
    return this.editForm.get('teams');
  }

  get instances() {
    return this.editForm.get('instances');
  }

  isChecked(param: string): boolean {
    const checkArray: FormArray = this.editForm.get('parameters') as FormArray;

    for (const control of checkArray.controls) {
      if (control.value === param) {
        return true;
      }
    }
    return false;
  }
}

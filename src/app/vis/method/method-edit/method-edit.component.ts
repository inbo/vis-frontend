import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
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
  isQuickSelectionOpen = false;
  editForm: FormGroup;
  cpueTestForm: FormGroup;
  isOpen = false;

  submitted: boolean;

  private methodCode: string;
  private subscription = new Subscription();

  method: Method;
  allParameters: string[];
  testResult = 0;

  constructor(private projectService: ProjectService, private formBuilder: FormBuilder, private router: Router,
              private methodsService: MethodsService, private cpueService: CpueService) {

  }

  ngOnInit(): void {
    this.cpueService.listAllParameters().subscribe(value => this.allParameters = value);
    this.editForm = this.formBuilder.group({
      description: ['', [Validators.maxLength(50)]],
      unit: ['', [Validators.maxLength(255)]],
      calculation: ['', [Validators.maxLength(255)], []],
      parameters: this.formBuilder.array([])
    });

    this.cpueTestForm = this.formBuilder.group({
      CATCH: [100]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.editForm.get('parameters') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      this.cpueTestForm.addControl(e.target.value, new FormControl(1));
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkArray.removeAt(i);
          this.cpueTestForm.removeControl(e.target.value);
          return;
        }
        i++;
      });
    }

    this.editForm.get('calculation').updateValueAndValidity();
  }

  public open(methodCode: string) {
    this.methodCode = methodCode;
    const method$ = this.methodsService.getMethod(methodCode);
    const cpue$ = this.cpueService.cpueParametersByMethodCode(methodCode);

    this.isOpen = true;

    this.cpueTestForm = this.formBuilder.group({
      CATCH: [100]
    });

    forkJoin([method$, cpue$]).subscribe(([method, parameters]) => {
      this.method = method;

      const params = parameters.map(value => new FormControl(value));
      this.editForm = this.formBuilder.group({
        description: [this.method.description, [Validators.required, Validators.maxLength(50)]],
        unit: [this.method.unit, [Validators.maxLength(255)]],
        calculation: [this.method.calculation, [], [this.calculationValidator()]],
        parameters: new FormArray(params)
      });

      for (const parameter of parameters) {
        this.cpueTestForm.addControl(parameter, new FormControl(2));
      }

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

  get code() {
    return this.editForm.get('code');
  }

  get name() {
    return this.editForm.get('name');
  }

  get description() {
    return this.editForm.get('description');
  }

  get unit() {
    return this.editForm.get('unit');
  }

  get calculation() {
    return this.editForm.get('calculation');
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

  test() {
    const formData = {
      calculation: this.calculation.value,
      parameters: this.cpueTestForm.getRawValue()
    };

    this.cpueService.testCalculation(formData).subscribe(value => this.testResult = value);
  }

  controls() {
    return Object.keys(this.cpueTestForm?.controls);
  }

  appendKeyToCalculation(key: string) {
    this.calculation.patchValue(this.calculation.value === null ? '' : this.calculation.value + key);
  }

  calculationValidator(): AsyncValidatorFn {
    return (): Observable<ValidationErrors | null> => {
      const formData = {
        calculation: this.calculation.value,
        parameters: this.editForm.get('parameters').value
      };

      return this.cpueService.validateCalculation(formData)
        .pipe(map(result => !result ? {invalidCalculation: true} : null));
    };
  }
}

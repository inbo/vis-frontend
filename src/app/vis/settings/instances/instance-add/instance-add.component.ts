import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {Account} from '../../../../domain/account/account';
import {AccountService} from '../../../../services/vis.account.service';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'vis-instance-add',
  templateUrl: './instance-add.component.html'
})
export class InstanceAddComponent implements OnInit {

  isOpen = false;
  submitted = false;

  addInstanceForm: UntypedFormGroup;

  accounts$ = new Subject<Account[]>();

  constructor(private accountService: AccountService, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.addInstanceForm = this.formBuilder.group({
      instanceCode: [null, [Validators.required], [this.codeValidator()]],
      description: [null, [Validators.required]],
      accounts: [[]]
    });
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.accountService.checkIfTeamExists(control.value)
        .pipe(map(result => result.valid ? {uniqueCode: true} : null));
    };
  }

  open() {
    this.isOpen = true;
  }

  get instanceCode() {
    return this.addInstanceForm.get('instanceCode');
  }

  get description() {
    return this.addInstanceForm.get('description');
  }

  save() {
    this.submitted = true;
    if (this.addInstanceForm.invalid) {
      return;
    }

    const rawValue = this.addInstanceForm.getRawValue();
    this.accountService.addInstance(rawValue).pipe(take(1)).subscribe(() => {
      window.location.reload();
    });
  }

  getAccounts(val: string) {
    this.accountService.getAccounts(val).pipe(take(1))
      .subscribe(value => this.accounts$.next(value));
  }
}

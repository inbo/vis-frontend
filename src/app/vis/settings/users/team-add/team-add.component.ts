import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {AccountService} from '../../../../services/vis.account.service';
import {Observable, Subject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Account} from '../../../../domain/account/account';
import {Instance} from '../../../../domain/account/instance';

@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html'
})
export class TeamAddComponent implements OnInit {

  isOpen = false;
  submitted = false;

  addTeamForm: FormGroup;

  instances$: Observable<Instance[]>
  accounts$ = new Subject<Account[]>();

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances();

    this.addTeamForm = this.formBuilder.group({
      teamCode: [null, [Validators.required], [this.codeValidator()]],
      description: [null, [Validators.required]],
      instanceCode: [null, [Validators.required]],
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

  get teamCode() {
    return this.addTeamForm.get('teamCode');
  }

  get description() {
    return this.addTeamForm.get('description');
  }

  get instanceCode() {
    return this.addTeamForm.get('instanceCode');
  }

  save() {
    this.submitted = true;
    if (this.addTeamForm.invalid) {
      return;
    }

    const rawValue = this.addTeamForm.getRawValue();
    this.accountService.addTeam(rawValue).pipe(take(1)).subscribe(() => {
      window.location.reload();
    });
  }

  getAccounts(val: string) {
    this.accountService.getAccounts(val).pipe(take(1))
      .subscribe(value => this.accounts$.next(value));
  }
}

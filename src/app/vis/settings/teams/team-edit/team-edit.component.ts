import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {Instance} from '../../../../domain/account/instance';
import {Account} from '../../../../domain/account/account';
import {AccountService} from '../../../../services/vis.account.service';
import {take} from 'rxjs/operators';
import {Team} from '../../../../domain/account/team';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html'
})
export class TeamEditComponent implements OnInit {

  isOpen = false;
  submitted = false;
  team: Team;

  editTeamForm: UntypedFormGroup;

  instances$: Observable<Instance[]>;
  accounts$ = new Subject<Account[]>();

  constructor(private accountService: AccountService, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances();

    this.editTeamForm = this.formBuilder.group({
      description: [null, [Validators.required]],
      accounts: [[]]
    });
  }

  open() {
    this.isOpen = true;
  }

  get description() {
    return this.editTeamForm.get('description');
  }

  get accounts() {
    return this.editTeamForm.get('accounts');
  }

  save() {
    this.submitted = true;
    if (this.editTeamForm.invalid) {
      return;
    }

    const rawValue = this.editTeamForm.getRawValue();
    this.accountService.editTeam(this.team.code, rawValue).pipe(take(1)).subscribe(() => {
      window.location.reload();
    });
  }

  getAccounts(val: string) {
    this.accountService.getAccounts(val).pipe(take(1))
      .subscribe(value => this.accounts$.next(value));
  }

  public setTeam(team: Team, accounts: Account[]) {
    this.team = team;

    this.description.patchValue(team.description);
    this.accounts.patchValue(accounts);
  }
}

import {Component, OnInit} from '@angular/core';
import {Account} from '../../../domain/account/account';
import {Observable} from 'rxjs';
import {Team} from '../../../domain/account/team';
import {AccountService} from '../../../services/vis.account.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {

  isOpen = false;

  account: Account;

  teams$: Observable<Team[]>;

  editAccountTeamForm: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.teams$ = this.accountService.listTeams();

    this.editAccountTeamForm = this.formBuilder.group({
      team: [null, [Validators.required]],
    });
  }

  open(account: Account) {
    this.account = account;
    this.editAccountTeamForm.get('team').patchValue(account.team?.code);
    this.isOpen = true;
  }

  save() {
    if (this.editAccountTeamForm.invalid) {
      return;
    }

    const rawValue = this.editAccountTeamForm.getRawValue();

    this.accountService.updateTeam(this.account.username, rawValue).pipe(take(1)).subscribe(() => {
      window.location.reload();
    });
  }

  get team() {
    return this.editAccountTeamForm.get('team');
  }
}

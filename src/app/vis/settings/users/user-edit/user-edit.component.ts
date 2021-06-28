import {Component, OnInit} from '@angular/core';
import {Account} from '../../../../domain/account/account';
import {Observable} from 'rxjs';
import {AccountService} from '../../../../services/vis.account.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {

  isOpen = false;

  account: Account;

  teams$: Observable<string[]>;

  editAccountTeamForm: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.teams$ = this.accountService.listTeams().pipe(map(teams => teams.map(team => team.code)));

    this.editAccountTeamForm = this.formBuilder.group({
      teams: [null],
    });
  }

  open(account: Account) {
    this.account = account;
    this.editAccountTeamForm.get('teams').patchValue(account.teams.map(team => team.code));
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

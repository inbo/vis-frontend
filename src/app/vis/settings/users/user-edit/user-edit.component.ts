import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  instances$: Observable<string[]>;

  editAccountTeamForm: FormGroup;

  @Output() onSaved: EventEmitter<any> = new EventEmitter();

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.teams$ = this.accountService.listTeams().pipe(map(teams => teams.map(team => team.name)));
    this.instances$ = this.accountService.listInstances().pipe(map(instances => instances.map(instance => instance.code)));

    this.editAccountTeamForm = this.formBuilder.group({
      teams: [[]],
      instances: [[]]
    });
  }

  open(account: Account) {
    this.account = account;
    this.editAccountTeamForm.get('teams').patchValue(account.teams);
    this.editAccountTeamForm.get('instances').patchValue(account.instances);
    this.isOpen = true;
  }

  save() {
    if (this.editAccountTeamForm.invalid) {
      return;
    }

    const rawValue = this.editAccountTeamForm.getRawValue();

    this.accountService.update(this.account.username, rawValue).pipe(take(1)).subscribe(() => {
      this.isOpen = false;
      this.onSaved.emit(true);
    });
  }

  get team() {
    return this.editAccountTeamForm.get('team');
  }
}

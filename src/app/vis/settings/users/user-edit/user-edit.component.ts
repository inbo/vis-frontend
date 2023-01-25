import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Account} from '../../../../domain/account/account';
import {Observable} from 'rxjs';
import {AccountService} from '../../../../services/vis.account.service';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {MultiSelectOption} from '../../../../shared-ui/multi-select/multi-select';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {

  isOpen = false;

  account: Account;

  teams$: Observable<MultiSelectOption[]>;
  instances$: Observable<MultiSelectOption[]>;

  editAccountTeamForm: UntypedFormGroup;

  @Output() onSaved: EventEmitter<any> = new EventEmitter();

  constructor(private accountService: AccountService, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(map(values => values.map(value => {
      return {value: value.code, displayValue: value.code};
    })));

    this.teams$ = this.accountService.listTeams().pipe(map(values => values.map(value => {
      return {value: value.name, displayValue: value.name};
    })));


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

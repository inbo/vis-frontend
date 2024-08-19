import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Account} from '../../../../domain/account/account';
import {Observable, Subscription} from 'rxjs';
import {AccountService} from '../../../../services/vis.account.service';
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {MultiSelectOption} from '../../../../shared-ui/multi-select/multi-select';
import {ProjectTeamFormSyncService} from '../../../../services/forms/project-team-form-sync.service';
import {ProjectTeam} from '../../../../domain/project/project';
import {instanceToSelectOption, teamToProjectTeamSelectOption} from '../../../../shared-ui/utils/select-options.util';

@Component({
  selector: 'vis-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {

  isOpen = false;

  account: Account;

  teams$: Observable<MultiSelectOption[]>;
  instances$: Observable<MultiSelectOption[]>;

  editAccountTeamForm: UntypedFormGroup;

  @Output() onSaved: EventEmitter<any> = new EventEmitter();
  private subscription = new Subscription();

  constructor(private accountService: AccountService, private formBuilder: UntypedFormBuilder,
              private projectTeamFormSyncService: ProjectTeamFormSyncService) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(
        take(1),
        map(values => values.map(instanceToSelectOption)),
    );

    this.teams$ = this.accountService.listTeams().pipe(
        take(1),
        map(values => values.map(teamToProjectTeamSelectOption)),
    );

    this.editAccountTeamForm = this.formBuilder.group({
      teams: [[]],
      instances: [[]],
    });

    this.projectTeamFormSyncService.syncTeamsAndInstances(
        this.editAccountTeamForm.get('teams') as FormControl<ProjectTeam[]>,
        this.editAccountTeamForm.get('instances') as FormControl<string[]>,
        this.subscription,
    );
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

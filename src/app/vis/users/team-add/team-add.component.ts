import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../services/vis.account.service';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {Account} from '../../../domain/account/account';

@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html'
})
export class TeamAddComponent implements OnInit {

  isOpen = false;
  submitted = false;

  addTeamForm: FormGroup;

  accounts$ = new Subject<Account[]>();

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.addTeamForm = this.formBuilder.group({
      teamCode: [null, [Validators.required]],
      description: [null, [Validators.required]],
      instanceCode: [null, [Validators.required]],
      accounts: [[]]
    });
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

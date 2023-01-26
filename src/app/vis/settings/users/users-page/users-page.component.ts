import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserEditComponent} from '../user-edit/user-edit.component';
import {AsyncPage} from '../../../../shared-ui/paging-async/asyncPage';
import {AccountService} from '../../../../services/vis.account.service';
import {AuthService} from '../../../../core/auth.service';
import {Account} from '../../../../domain/account/account';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent implements OnInit {

  @ViewChild(UserEditComponent) userEditComponent;

  loading = false;

  pager: AsyncPage<Account>;
  accounts: Observable<Account[]>;

  filterForm: UntypedFormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private accountService: AccountService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: UntypedFormBuilder, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Gebruikers');

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        name: [queryParams.name],
        sort: [queryParams.sort ?? ''],
        page: [queryParams.page ?? null],
        size: [queryParams.size ?? null]
      },
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('name').patchValue(params.name ? params.name : '');
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
        this.filterForm.get('page').patchValue(params.page ? params.page : null);
        this.filterForm.get('size').patchValue(params.size ? params.size : null);

        this.getAccounts();
      })
    );
  }

  getAccounts() {
    this.loading = true;
    this.accounts = of([]);

    const page = this.filterForm.get('page').value ?? 0;
    const size = this.filterForm.get('size').value ?? 20;

    this.subscription.add(
      this.accountService.listAccounts(page, size, this.filterForm.getRawValue()).subscribe((value) => {
        this.pager = value;
        this.accounts = of(value.content);
        this.loading = false;
      })
    );
  }


  filter() {
    const rawValue = this.filterForm.getRawValue();
    const queryParams: Params = {...rawValue, page: 1};

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      });
  }

  editAccount(account: Account) {
    this.userEditComponent.open(account);
  }

  reload() {
    window.location.reload();
  }
}

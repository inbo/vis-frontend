import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Role} from '../../../core/_models/role';
import {AccountService} from '../../../services/vis.account.service';
import {AuthService} from '../../../core/auth.service';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Account} from '../../../domain/account/account';
import {UserEditComponent} from '../user-edit/user-edit.component';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Gebruikers', url: '/gebruikers'},
  ];

  @ViewChild(UserEditComponent) userEditComponent;

  role = Role;

  loading = false;

  pager: AsyncPage<Account>;
  accounts: Observable<Account[]>;

  filterForm: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title, private accountService: AccountService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Gebruikers');

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filterForm = this.formBuilder.group(
      {
        name: [queryParams.name],
        sort: [queryParams.sort ?? '']
      },
    );

    // this.subscription.add(
    //   this.filterForm.valueChanges.pipe(
    //     debounceTime(300),
    //     distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    //     .subscribe(_ => this.filter())
    // );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.filterForm.get('name').patchValue(params.name ? params.name : '');
        this.filterForm.get('sort').patchValue(params.sort ? params.sort : '');
      })
    );

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getAccounts(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  getAccounts(page: number, size: number) {
    this.loading = true;
    this.accounts = of([]);
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
      }).then();

    this.getAccounts(1, 20);
  }

  editAccount(account: Account) {
    this.userEditComponent.open(account);
  }
}

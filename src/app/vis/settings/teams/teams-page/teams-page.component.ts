import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPage} from '../../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {Team} from '../../../../domain/account/team';
import {Title} from '@angular/platform-browser';
import {AccountService} from '../../../../services/vis.account.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../core/auth.service';
import {TeamAddComponent} from '../team-add/team-add.component';
import {TeamEditComponent} from '../team-edit/team-edit.component';
import {take} from 'rxjs/operators';

@Component({
  selector: 'vis-teams-page',
  templateUrl: './teams-page.component.html'
})
export class TeamsPageComponent implements OnInit, OnDestroy {

  @ViewChild(TeamAddComponent) teamAddComponent: TeamAddComponent;
  @ViewChild(TeamEditComponent) teamEditComponent: TeamEditComponent;

  loading = false;

  pager: AsyncPage<Team>;
  teams: Observable<Team[]>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private accountService: AccountService, private activatedRoute: ActivatedRoute,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Teams');

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getTeams(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTeams(page: number, size: number) {
    this.loading = true;
    this.teams = of([]);
    this.subscription.add(
      this.accountService.getTeams(page, size).subscribe((value) => {
        this.pager = value;
        this.teams = of(value.content);
        this.loading = false;
      })
    );
  }

  addTeam() {
    this.teamAddComponent.open();
  }

  editTeam(team: Team) {
    this.accountService.listAccountsForTeam(team.code)
      .pipe(take(1))
      .subscribe(accounts => {
        this.teamEditComponent.setTeam(team, accounts);
        this.teamEditComponent.open();
      });
  }
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPage} from '../../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {Team} from '../../../../domain/account/team';
import {Title} from '@angular/platform-browser';
import {AccountService} from '../../../../services/vis.account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../../../core/auth.service';
import {TeamAddComponent} from '../team-add/team-add.component';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit, OnDestroy {

  @ViewChild(TeamAddComponent) teamAddComponent;

  loading = false;

  pager: AsyncPage<Team>;
  teams: Observable<Team[]>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private accountService: AccountService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, public authService: AuthService) {
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
}

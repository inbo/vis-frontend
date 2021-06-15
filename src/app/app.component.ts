import {Component, OnDestroy} from '@angular/core';
import {AuthService} from './core/auth.service';
import {environment} from '../environments/environment';
import {AccountService} from './services/vis.account.service';
import {Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  private subscription = new Subscription();

  constructor(private authService: AuthService, private accountService: AccountService) {
    this.authService.runInitialLoginSequence();

    this.subscription.add(
      this.authService.isDoneLoading$
        .pipe(
          mergeMap(value => this.accountService.registerAccount())
        )
        .subscribe(value => {
          console.log('registered', value);
        })
    );


  }


  isProductionEnv() {
    return environment.env === 'prod';
  }

  ngOnDestroy(): void {
  }
}

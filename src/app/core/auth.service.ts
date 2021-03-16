import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {OAuthErrorEvent, OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Role} from './_models/role';

@Injectable({providedIn: 'root'})
export class AuthService implements OnDestroy {

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  private subscription = new Subscription();

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$
  ]).pipe(map(values => values.every(b => b)));


  ngOnDestroy(): void {
  }

  private navigateToLoginPage() {
    this.router.navigateByUrl('/');
  }

  constructor(private oauthService: OAuthService, private router: Router) {
    this.subscription.add(
      this.oauthService.events.subscribe(event => {
        if (environment.showDebugInformation) {
          if (event instanceof OAuthErrorEvent) {
            console.error('OAuthErrorEvent Object:', event);
          } else {
            console.warn('OAuthEvent Object:', event);
          }
        }
      })
    );

    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.subscription.add(
      this.oauthService.events
        .subscribe(_ => {
          this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
        })
    );

    this.subscription.add(
      this.oauthService.events
        .pipe(filter(e => ['token_received'].includes(e.type)))
        .subscribe(() => this.oauthService.loadUserProfile())
    );

    this.subscription.add(
      this.oauthService.events
        .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
        .subscribe(() => this.navigateToLoginPage())
    );

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence(): Promise<void> {
    if (environment.showDebugInformation && location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(location.hash.substr(1).split('&').map(kvp => kvp.split('=')));
    }

    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return this.oauthService.loadDiscoveryDocument()
      // 1. HASH LOGIN:
      // Try to log in via hash fragment after redirect back
      // from IdServer from initImplicitFlow:
      .then(() => this.oauthService.tryLogin())

      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }

        // 2. SILENT LOGIN:
        // Try to log in via a refresh because then we can prevent
        // needing to redirect the user:
        return this.oauthService.silentRefresh()
          .then(() => Promise.resolve())
          .catch(result => {
            // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
            // Only the ones where it's reasonably sure that sending the
            // user to the IdServer will help.
            const errorResponsesRequiringUserInteraction = [
              'interaction_required',
              'login_required',
              'account_selection_required',
              'consent_required',
            ];

            if (result
              && result.reason
              && result.reason.params
              && result.reason.params.error
              && errorResponsesRequiringUserInteraction.indexOf(result.reason.params.error) >= 0) {

              // 3. ASK FOR LOGIN:
              // At this point we know for sure that we have to ask the
              // user to log in, so we redirect them to the IdServer to
              // enter credentials.
              //
              // Enable this to ALWAYS force a user to login.
              // this.login();
              //
              // Instead, we'll now do this:
              console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
              return Promise.resolve();
            }

            // We can't handle the truth, just pass on the problem to the
            // next handler.
            return Promise.reject(result);
          });
      })

      .then(() => {
        this.isDoneLoadingSubject$.next(true);

        // Check for the strings 'undefined' and 'null' just to be sure. Our current
        // login(...) should never have this, but in case someone ever calls
        // initImplicitFlow(undefined | null) this could happen.
        if (this.oauthService.state && this.oauthService.state !== 'undefined' && this.oauthService.state !== 'null') {
          let stateUrl = this.oauthService.state;
          if (stateUrl.startsWith('/') === false) {
            stateUrl = decodeURIComponent(stateUrl);
          }
          console.log(`There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`);
          this.router.navigateByUrl(stateUrl);
        }
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  public logout() {
    this.oauthService.logOut();
  }

  public get fullName() {
    const identityClaims = this.oauthService.getIdentityClaims();
    // @ts-ignore
    return identityClaims == null ? '' : `${identityClaims.given_name} ${identityClaims.family_name}`;
  }

  public get username() {
    const identityClaims = this.oauthService.getIdentityClaims();
    // @ts-ignore
    return identityClaims == null ? '' : identityClaims.preferred_username;
  }

  public get picture() {
    const identityClaims = this.oauthService.getIdentityClaims();
    // @ts-ignore
    return identityClaims == null ? '' : identityClaims.picture;
  }

  public get email() {
    const identityClaims = this.oauthService.getIdentityClaims();
    // @ts-ignore
    return identityClaims == null ? '' : identityClaims.email;
  }

  public get clientRoles(): Role[] {
    const identityClaims = this.oauthService.getIdentityClaims();

    const currentRoles: Role[] = [];

    // @ts-ignore
    const roles: string[] = identityClaims == null ? [] : identityClaims.client_roles
      .map(role => role.replace('ROLE_', ''));

    console.log(roles);

    roles.forEach(value => {
      switch (value) {
        case 'BEWERK_PROJECT':
          currentRoles.push(Role.EditProject);
          break;
        case 'AANMAAK_PROJECT':
          currentRoles.push(Role.CreateProject);
          break;
      }
    });

    return currentRoles;
  }

  public hasRole(role: Role): boolean {
    return this.clientRoles.indexOf(role) >= 0;
  }
}

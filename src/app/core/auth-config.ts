import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.keycloakIssuer,
  clientId: environment.keycloakClientId,
  responseType: 'code',
  redirectUri: window.location.origin,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile email roles',
  useSilentRefresh: true,
  silentRefreshTimeout: 2000,
  sessionChecksEnabled: true,
  showDebugInformation: environment.showDebugInformation,
  clearHashAfterLogin: false,
  nonceStateSeparator : 'semicolon'
};

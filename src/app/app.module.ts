import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgTransitionModule} from 'ng-transition';
import {CommonModule} from '@angular/common';
import {CoreModule} from './core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertModule} from './_alert';
import {MyMissingTranslationHandler} from './missing-translation-handler';
import {LandingPageModule} from './landing-page/landing-page.module';
import {SharedUiModule} from './shared-ui/shared-ui.module';
import {VisModule} from './vis/vis.module';
import {ReleaseNotesModule} from './release-notes/release-notes.module';
import {environment} from '../environments/environment';
import {MultiTranslateHttpLoader} from './core/multi-http-loader';
import {ErrorsModule} from './errors/errors.module';
import {HttpErrorInterceptor} from './core/http.error.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    LandingPageModule,
    BrowserModule,
    CoreModule.forRoot(),
    NgTransitionModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'nl',
      useDefaultLang: true
    }),
    SharedUiModule,
    VisModule,
    ReleaseNotesModule,
    ErrorsModule,
    // should always be last so that unknown routes are routed to the 404 page
    AppRoutingModule
  ],
  providers: [
    {
      provide: MissingTranslationHandler,
      useClass: MyMissingTranslationHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/', suffix: '.json'},
    {prefix: `${environment.apiUrl}/translations/`, suffix: ''}
  ]);
}

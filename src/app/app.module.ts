import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgTransitionModule} from "ng-transition";
import {CommonModule} from "@angular/common";
import {CoreModule} from "./core/core.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertModule} from "./_alert";
import {VisService} from "./vis.service";
import {MyMissingTranslationHandler} from './missing-translation-handler';
import {LandingPageModule} from "./landing-page/landing-page.module";
import {SharedUiModule} from "./shared-ui/shared-ui.module";
import {VisModule} from "./vis/vis.module";
import {ReleaseNotesModule} from "./release-notes/release-notes.module";

@NgModule({
  declarations: [
    AppComponent,

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

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'nl'
    }),
    SharedUiModule,
    VisModule,
    ReleaseNotesModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, VisService],
      multi: true
    },
    {
      provide: MissingTranslationHandler,
      useClass: MyMissingTranslationHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translate: TranslateService, visService: VisService) {
  return () => {
    return visService.translations('nl').subscribe(value => {
      translate.setTranslation('nl', value, true);
      translate.setDefaultLang('nl');
      return translate.use('nl').toPromise();
    })
  };
}

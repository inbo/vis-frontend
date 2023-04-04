import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';

import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
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
import {NgxTippyModule} from 'ngx-tippy-wrapper';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {HttpCacheInterceptorModule} from '@ngneat/cashew';
import {NgPipesModule} from 'ngx-pipes';

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
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            defaultLanguage: 'nl',
            useDefaultLang: true,
        }),
        SharedUiModule,
        HttpCacheInterceptorModule.forRoot(),
        VisModule,
        ReleaseNotesModule,
        ErrorsModule,
        NgxTippyModule,
        NgPipesModule,
        // should always be last so that unknown routes are routed to the 404 page
        AppRoutingModule,
    ],
    providers: [
        {
            provide: MissingTranslationHandler,
            useClass: MyMissingTranslationHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeTranslations,
            deps: [TranslateService, Injector],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}

function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        {prefix: './assets/i18n/', suffix: '.json'},
        {prefix: `${environment.apiUrl}/translations/`, suffix: ''},
    ]);
}

function initializeTranslations(translate: TranslateService) {
    return () => new Promise<any>((resolve: any) => {
        translate.use('nl').subscribe({
            next: () => console.log(`Successfully initialized 'nl' language.'`),
            error: err => console.error(`Problem with 'nl' language initialization.'`, err)
        });
    });
}

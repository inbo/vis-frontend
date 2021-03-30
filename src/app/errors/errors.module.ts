import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorsRoutingModule} from './errors-routing.module';
import {ForbiddenPageComponent} from './forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { InternalServerErrorPageComponent } from './internal-server-error-page/internal-server-error-page.component';
import { ServiceUnavailablePageComponent } from './service-unavailable-page/service-unavailable-page.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    ForbiddenPageComponent,
    NotFoundPageComponent,
    InternalServerErrorPageComponent,
    ServiceUnavailablePageComponent
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    TranslateModule
  ]
})
export class ErrorsModule {
}

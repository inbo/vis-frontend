import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForbiddenPageComponent} from './forbidden-page/forbidden-page.component';
import {ServiceUnavailablePageComponent} from './service-unavailable-page/service-unavailable-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';

const routes: Routes = [
  {path: 'forbidden', component: ForbiddenPageComponent},
  {path: 'not-found', component: NotFoundPageComponent},
  {path: 'service-unavailable', component: ServiceUnavailablePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlertComponent} from './alert.component';
import {NgTransitionModule} from 'ng-transition';

@NgModule({
  imports: [CommonModule, NgTransitionModule],
  declarations: [AlertComponent],
  exports: [AlertComponent]
})
export class AlertModule {
}

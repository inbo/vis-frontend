import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarLayoutComponent} from './layouts/sidebar-layout/sidebar-layout.component';
import {NavigationLinkComponent} from './layouts/sidebar-layout/navigation-link/navigation-link.component';
import {ProfileDropdownComponent} from './profile-dropdown/profile-dropdown.component';
import {StackedLayoutComponent} from './layouts/stacked-layout/stacked-layout.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {PagingAsyncComponent} from './paging-async/paging-async.component';
import {PagingComponent} from './paging/paging.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {ToggleWithIconComponent} from './toggle-with-icon/toggle-with-icon.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {SlideOverComponent} from './slide-over/slide-over.component';
import {TextCounterComponent} from './text-counter/text-counter.component';
import {ExpandableFilterComponent} from './expandable-filter/expandable-filter.component';
import {RadioGroupComponent} from './radio-group/radio-group.component';
import {CheckGroupComponent} from './check-group/check-group.component';
import {NgTransitionModule} from 'ng-transition';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {StepComponent} from './step/step.component';
import {TipComponent} from "./tip/tip.component";
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { DaterangeComponent } from './daterange/daterange.component';

@NgModule({
  declarations: [
    SidebarLayoutComponent,
    NavigationLinkComponent,
    ProfileDropdownComponent,
    StackedLayoutComponent,
    BreadcrumbComponent,
    PagingAsyncComponent,
    PagingComponent,
    LoadingSpinnerComponent,
    ToggleWithIconComponent,
    DatepickerComponent,
    SlideOverComponent,
    TextCounterComponent,
    ExpandableFilterComponent,
    RadioGroupComponent,
    CheckGroupComponent,
    StepComponent,
    TipComponent,
    SearchableSelectComponent,
    DaterangeComponent,
  ],
    exports: [
        SidebarLayoutComponent,
        NavigationLinkComponent,
        ProfileDropdownComponent,
        StackedLayoutComponent,
        BreadcrumbComponent,
        PagingAsyncComponent,
        PagingComponent,
        LoadingSpinnerComponent,
        ToggleWithIconComponent,
        DatepickerComponent,
        SlideOverComponent,
        TextCounterComponent,
        ExpandableFilterComponent,
        RadioGroupComponent,
        CheckGroupComponent,
        StepComponent,
        SearchableSelectComponent,
        DaterangeComponent,
    ],
  imports: [
    RouterModule,
    CommonModule,
    NgTransitionModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class SharedUiModule {
}

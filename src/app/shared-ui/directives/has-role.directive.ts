import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {Role} from '../../core/_models/role';
import {takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[visHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() visHasRole: Role;

  stop$ = new Subject();

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {
  }

  ngOnDestroy() {
    this.stop$.next();
  }

  ngOnInit() {
    this.authService.roles$
      .pipe(
        takeUntil(this.stop$)
      )
      .subscribe((roles: Role[]) => {
        const hasRole = roles.indexOf(this.visHasRole) >= 0;
        if (hasRole) {
          if (!this.isVisible) {
            this.isVisible = true;
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      });
  }
}

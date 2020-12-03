import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Alert, AlertType} from './alert.model';
import {AlertService} from './alert.service';

@Component({selector: 'alert', templateUrl: 'alert.component.html'})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';

  showAlert = false;
  alert: Alert;
  alertSubscription: Subscription;
  routeSubscription: Subscription;
  private timer: number;

  constructor(private router: Router, private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.alert = alert;
        this.showAlert = true;

        if (alert.autoClose) {
          this.timer = setTimeout(() => {
            this.alert = null;
            return this.showAlert = false;
          }, 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showAlert = false;
        this.alert = null;
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert() {
    this.alert = null;
    this.showAlert = false;
  }

  isInfo() {
    return this.alert && this.alert.type === AlertType.Info
  }

  isWarning() {
    return this.alert && this.alert.type === AlertType.Warning
  }

  isSuccess() {
    return this.alert && this.alert.type === AlertType.Success
  }

  isError() {
    return this.alert && this.alert.type === AlertType.Error
  }
}

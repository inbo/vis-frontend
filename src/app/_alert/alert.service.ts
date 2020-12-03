import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  success(title: string, message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, title, message }));
  }

  error(title: string, message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, title, message }));
  }

  unexpectedError(options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, title: 'Onverwachte fout', message: 'Neem contact op met een verantwoordelijke om dit probleem te melden.' }));
  }

  info(title: string, message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, title, message }));
  }

  warn(title: string, message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, title, message }));
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

}

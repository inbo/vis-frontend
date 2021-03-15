import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {HasUnsavedData} from './core.interface';

@Injectable()
export class HasUnsavedDataGuard implements CanDeactivate<any> {
  canDeactivate(component: HasUnsavedData): boolean {
    if (component.hasUnsavedData && component.hasUnsavedData()) {
      return confirm('Wijzigingen die je hebt aangebracht, worden mogelijk niet opgeslagen.');
    }
    return true;
  }
}

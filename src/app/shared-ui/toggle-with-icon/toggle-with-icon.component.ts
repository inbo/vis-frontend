import {Component} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-toggle-with-icon',
  templateUrl: './toggle-with-icon.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleWithIconComponent,
      multi: true
    }
  ]
})
export class ToggleWithIconComponent implements ControlValueAccessor {
  on = false;

  private onChange: Function;
  private onTouch: Function;

  writeValue(obj: boolean): void {
    this.on = obj;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  dateValueChanged(): void {
    this.onChange(this.on);
  }

  toggle() {
    this.on = !this.on;
    this.onChange(this.on);
  }

}

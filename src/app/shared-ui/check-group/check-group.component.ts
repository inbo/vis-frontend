import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {CheckOption} from './checkOption';

@Component({
  selector: 'vis-check-group',
  templateUrl: './check-group.component.html'
})
export class CheckGroupComponent implements OnInit {
  form: UntypedFormGroup;

  @Input() options: CheckOption[];
  @Input() name: string;
  @Output() checked = new EventEmitter<any>();

  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
  }

  isChecked(value: string): boolean {
    return this.form.get(this.name).get(value).value;
  }

  isDisabled(value: string): boolean {
    return this.form.get(this.name).get(value).disabled;
  }

  clicked($event: any, value: string) {
    this.checked.emit({checked: $event.currentTarget.checked, option: value});
  }
}

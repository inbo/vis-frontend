import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {CheckOption} from './checkOption';

@Component({
  selector: 'app-check-group',
  templateUrl: './check-group.component.html'
})
export class CheckGroupComponent implements OnInit {
  form: FormGroup;

  @Input() options: CheckOption[];
  @Input() name: string;

  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    console.log(this.form);
    console.log(this.name);
  }


  isChecked(value: string): boolean {
    return this.form.get(this.name).get(value).value;
  }
}

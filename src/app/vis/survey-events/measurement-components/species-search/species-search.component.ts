import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
  selector: 'app-species-search',
  templateUrl: './species-search.component.html'
})
export class SpeciesSearchComponent extends MeasurementComponentDirective implements OnInit {
  @Input() index: number;

  @Input() taxons: any;

  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {
    super();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  onSpeciesChange() {
    this.changed.emit();
  }

  getSpecies($event: any) {
    this.onSearch.emit($event);
  }

  fieldName(): string {
    return 'species';
  }
}

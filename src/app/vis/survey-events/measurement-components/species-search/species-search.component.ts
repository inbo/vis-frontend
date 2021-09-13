import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {SearchableSelectComponent} from '../../../../shared-ui/searchable-select/searchable-select.component';

@Component({
  selector: 'app-species-search',
  templateUrl: './species-search.component.html'
})
export class SpeciesSearchComponent extends MeasurementComponentDirective implements OnInit {

  @ViewChild(SearchableSelectComponent) searchableSelect: SearchableSelectComponent;

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

  keydown($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      return;
    }
    super.keydown($event);
  }


  onSpeciesChange() {
    this.changed.emit();
  }

  getSpecies($event: any) {
    this.onSearch.emit($event);
  }

  enterPressedEvent($event: any) {
    if (!$event.open) {
      // @ts-ignore
      super.keydown($event.event);
    }
  }

  fieldName(): string {
    return 'species';
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {SearchableSelectOption} from '../../../../shared-ui/searchable-select/SearchableSelectOption';
import {Taxon} from '../../../../domain/taxa/taxon';
import {TaxonRowValue} from '../../measurement-row/taxon-row-value.model';

@Component({
  selector: 'app-species-search',
  templateUrl: './species-search.component.html'
})
export class SpeciesSearchComponent extends MeasurementComponentDirective implements OnInit {

  @Input() index: number;
  @Input() taxons: SearchableSelectOption<Taxon, TaxonRowValue>[];

  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() changed: EventEmitter<void> = new EventEmitter();

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

  getSpecies($event: string) {
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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {SearchableSelectOption} from '../../../../shared-ui/searchable-select/SearchableSelectOption';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'vis-species-search',
    templateUrl: './species-search.component.html',
})
export class SpeciesSearchComponent extends MeasurementComponentDirective {

    @Input() taxons: Array<SearchableSelectOption<number>>;
    @Output() onSearch: EventEmitter<string> = new EventEmitter();
    @Output() changed: EventEmitter<void> = new EventEmitter();

    selectConfiguration: SearchableSelectConfig = new SearchableSelectConfigBuilder()
        .minQueryLength(0)
        .searchPlaceholder('Begin met typen om te zoeken')
        .build();
    fieldName = 'species';

    keydown($event: KeyboardEvent) {
        if (['Enter', 'Tab', 'ArrowLeft', 'ArrowRight'].includes($event.key)) {
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

    enterPressedEvent($event: {open: boolean, event: KeyboardEvent}) {
        if ($event.open) {
            super.keydown($event.event);
        }
    }
}

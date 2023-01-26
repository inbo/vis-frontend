import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {SearchableSelectOption} from '../../../../shared-ui/searchable-select/SearchableSelectOption';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'app-species-search',
    templateUrl: './species-search.component.html',
})
export class SpeciesSearchComponent extends MeasurementComponentDirective implements OnInit {

    @Input() taxons: Array<SearchableSelectOption<number>>;
    @Input() index: number;
    @Output() onSearch: EventEmitter<string> = new EventEmitter();
    @Output() changed: EventEmitter<void> = new EventEmitter();

    form: UntypedFormGroup;
    selectConfiguration: SearchableSelectConfig = new SearchableSelectConfigBuilder()
        .minQueryLength(0)
        .searchPlaceholder('Begin met typen om te zoeken')
        .build();

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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {take} from 'rxjs/operators';
import {TaxaService} from '../../../services/vis.taxa.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {TandemvaultPictureDetail} from '../../../domain/tandemvault/picture';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Taxon} from '../../../domain/taxa/taxon';

@Component({
    selector: 'vis-image-detail',
    templateUrl: './image-detail.component.html',
})
export class ImageDetailComponent implements OnInit {

    @Input()
    canAddTags = true;

    @Input()
    slug: string;

    @Input()
    detail: TandemvaultPictureDetail;

    @Output() downloadPicture = new EventEmitter<number>();
    @Output() addTags = new EventEmitter<number>();
    @Output() removeTags = new EventEmitter<number>();
    @Output() removeTag = new EventEmitter<any>();
    @Output() customTagAdded = new EventEmitter<any>();
    @Output() speciesTagAdded = new EventEmitter<any>();

    customTag = '';
    species: SearchableSelectOption<Taxon>[] = [];
    addSpeciesTagForm: UntypedFormGroup;

    constructor(private taxaService: TaxaService, private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit(): void {
        this.addSpeciesTagForm = this.formBuilder.group(
            {
                species: [],
            },
        );
    }

    download(id: number) {
        this.downloadPicture.emit(id);
    }

    tags(id: number) {
        this.addTags.emit(id);
    }

    clearTags(id: number) {
        this.removeTags.emit(id);
    }

    addCustomTag(id: number) {
        this.customTagAdded.emit({assetId: id, tag: this.customTag});
        this.customTag = '';
    }

    addSpeciesTag(id: number) {
        this.speciesTagAdded.emit({assetId: id, taxonId: this.addSpeciesTagForm.get('species').value as number});
        this.addSpeciesTagForm.get('species').patchValue(null);
    }

    removeTagClick(id: number, tag: string) {
        this.removeTag.emit({assetId: id, tag});
    }

    getSpecies(val: string) {
        this.taxaService
            .getTaxa(val)
            .pipe(take(1))
            .subscribe(
                taxa =>
                    this.species = taxa.map(
                        taxon => ({
                            displayValue: `${taxon.id.value}`,
                            value: taxon,
                        })));
    }
}

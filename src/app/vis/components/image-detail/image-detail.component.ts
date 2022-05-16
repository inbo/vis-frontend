import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {map} from 'rxjs/operators';
import {TaxaService} from '../../../services/vis.taxa.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {TandemvaultPictureDetail} from '../../../domain/tandemvault/picture';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html'
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
  species: SearchableSelectOption[] = [];
  addSpeciesTagForm: FormGroup;

  constructor(private taxaService: TaxaService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.addSpeciesTagForm = this.formBuilder.group(
      {
        species: []
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
    this.taxaService.getTaxa(val).pipe(
      map(taxa => {
        return taxa.map(taxon => ({
          selectValue: taxon.id.value,
          option: taxon
        }));
      })
    ).subscribe(value => this.species = value);
  }
}

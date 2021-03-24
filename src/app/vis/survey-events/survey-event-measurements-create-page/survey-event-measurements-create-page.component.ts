import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {VisService} from '../../../vis.service';
import {Option} from '../../../shared-ui/searchable-select/option';

@Component({
  selector: 'app-survey-event-measurements-create-page',
  templateUrl: './survey-event-measurements-create-page.component.html'
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit, OnDestroy {

  @ViewChildren('lines') lines: QueryList<HTMLDivElement>;

  species$ = new Subject<Option[]>();

  measurementsForm: FormGroup;

  private subscription = new Subscription();

  fieldsOrder = [
    'species',
    'amount',
    'length',
    'weight',
    'gender',
    'lengthType',
    'afvisBeurtNumber',
    'comment'
  ];

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private visService: VisService) {
  }

  ngOnInit(): void {
    this.measurementsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });

    this.subscription.add(fromEvent(window, 'keydown').pipe(
      filter((event: KeyboardEvent) => {
        return event.ctrlKey && event.key.toLowerCase() === 'm';
      })
    ).subscribe(() => this.items().push(this.createItem(this.getPreviousSpecies()))));
  }

  getSpecies(val: string) {
    this.visService.getTaxa(val).pipe(
      map(taxa => {
        return taxa.map(taxon => ({
          id: taxon.id.value,
          translateKey: `taxon.id.${taxon.id.value}`
        }));
      })
    ).subscribe(value => this.species$.next(value));
  }

  createItem(species?: any): FormGroup {
    return this.formBuilder.group({
      species: new FormControl(species ?? '', Validators.required),
      amount: new FormControl(1, Validators.min(1)),
      length: new FormControl(''),
      weight: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      lengthType: new FormControl('', Validators.required),
      afvisBeurtNumber: new FormControl(1, Validators.min(1)),
      comment: new FormControl('', Validators.required)
    });
  }

  items(): FormArray {
    return this.measurementsForm.get('items') as FormArray;
  }

  getPreviousSpecies() {
    return this.items().at(this.items().length - 1).get('species').value;
  }

  onKeyPress(event: KeyboardEvent, i: number) {
    if (event.key === 'Tab' && (this.items() === undefined || (i + 1) === this.items().length)) {
      this.items().push(this.createItem(this.getPreviousSpecies()));
    }
  }

  createMeasurements() {
    if (this.measurementsForm.invalid) {
      return;
    }

    const measurements = this.measurementsForm.getRawValue();

    measurements.items.map(val => {
      val.taxonId = val.species.id;
      delete val.species;
      return val;
    });

    this.visService.createMeasurements(measurements, this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId).subscribe(console.log);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addNewLine() {
    this.items().push(this.createItem(this.getPreviousSpecies()));
  }

  newLineOnEnter(event: KeyboardEvent, i: number) {
    if (event.key === 'Enter') {
      if (this.items() === undefined || (i + 1) === this.items().length) {
        this.items().push(this.createItem(this.getPreviousSpecies()));
      }
      setTimeout(() => {
        document.getElementById('length-' + (i + 1)).focus();
      }, 0);
    }

  }

  focusNextLineOnEnter(event: KeyboardEvent, i: number) {
    if (event.key === 'Enter') {
      let splittedId = (event.currentTarget as HTMLElement).id.split('-');
      let nextElement = document.getElementById(splittedId[0] + '-' + (i + 1));
      if (nextElement !== null) {
        nextElement.focus();
      }
    }
  }

  navigateOnArrow(event: KeyboardEvent, i: number) {
    let splittedId = (event.currentTarget as HTMLElement).id.split('-');

    if (event.ctrlKey && event.key === 'ArrowUp') {
      event.preventDefault();
      let nextElement = document.getElementById(splittedId[0] + '-' + (i - 1));
      if (nextElement !== null) {
        nextElement.focus();
      }
    } else if (event.ctrlKey && event.key === 'ArrowDown') {
      event.preventDefault();
      let nextElement = document.getElementById(splittedId[0] + '-' + (i + 1));
      if (nextElement !== null) {
        nextElement.focus();
      }
    } else if (event.ctrlKey && event.key === 'ArrowLeft') {
      let nextId = this.fieldsOrder.indexOf(splittedId[0]) - 1;
      if (nextId < 0) {
        nextId = 0
      }

      let nextElement = document.getElementById(this.fieldsOrder[nextId] + '-' + i);
      if (nextElement !== null) {
        nextElement.focus();
      }
    } else if (event.ctrlKey && event.key === 'ArrowRight') {
      let nextId = this.fieldsOrder.indexOf(splittedId[0]) + 1;
      if (nextId > this.fieldsOrder.length - 1) {
        nextId = this.fieldsOrder.length - 1
      }

      let nextElement = document.getElementById(this.fieldsOrder[nextId] + '-' + i);
      if (nextElement !== null) {
        nextElement.focus();
      }
    }
  }

  remove(i: number) {
    this.items().removeAt(i);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
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

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {
      title: this.activatedRoute.snapshot.params.projectCode,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode
    },
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: 'Metingen',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/metingen'
    },
    {
      title: 'Toevoegen',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/metingen/toevoegen'
    }
  ];

  species$ = new Subject<Option[]>();

  measurementsForm: FormGroup;

  private subscription = new Subscription();

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
      lengthMeasurement: new FormControl('', Validators.required),
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
    /*    if (this.measurementsForm.invalid) {
          return;
        }*/

    console.log(this.measurementsForm.getRawValue());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-survey-event-measurements-create-page',
  templateUrl: './survey-event-measurements-create-page.component.html'
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit, AfterViewInit, AfterViewChecked {

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

  private measurementsForm: FormGroup;
  private items: FormArray;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {


  }

  ngOnInit(): void {
    this.measurementsForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem() ])
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      species: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      lengthMeasurement: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    });
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked(): void {
  }

  onKeyPress(event: KeyboardEvent, i: number) {
    if (event.key === 'Tab' && (this.items === undefined || (i+1) == this.items.length)) {
      this.items = this.measurementsForm.get('items') as FormArray;
      this.items.push(this.createItem());
    }
  }

  isInvalid(i) {
    return (<FormArray>this.measurementsForm.get('items')).controls[i].invalid;
  }
}

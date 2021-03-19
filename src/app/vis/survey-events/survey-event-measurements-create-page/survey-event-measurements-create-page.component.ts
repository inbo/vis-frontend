import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-survey-event-measurements-create-page',
  templateUrl: './survey-event-measurements-create-page.component.html'
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit {

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

  measurementsForm = new FormArray([]);

  constructor(private activatedRoute: ActivatedRoute) {
    this.measurementsForm.push(this.createMeasurementForm());
  }

  ngOnInit(): void {
  }

  createMeasurementForm(): FormGroup {
    return new FormGroup({
      species: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      lengthMeasurement: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    });
  }

  onKeyPress(event: KeyboardEvent, i: number) {
    if (event.key === 'Tab' && (i + 1) === this.measurementsForm.length) {
      this.measurementsForm.push(this.createMeasurementForm());
    }
  }
}

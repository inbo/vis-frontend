import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

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

  measurements = new FormArray([]);

  private hasListener = false;

  constructor(private activatedRoute: ActivatedRoute) {
    this.measurements.push(new FormGroup({
      species: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      lengthMeasurement: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required)
    }));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let commentFields = document.getElementsByName('comment');
    const commentField = commentFields[commentFields.length - 1];

    this.addEventListener(commentField);
  }

  ngAfterViewChecked(): void {
    if (this.hasListener) {
      return;
    }

    const commentFields = document.getElementsByName('comment');
    const commentField = commentFields[commentFields.length - 1];

    this.addEventListener(commentField);

    const speciesFields = document.getElementsByName('species');
    setTimeout(() => {
      speciesFields[speciesFields.length - 1].focus();
    });
  }

  private addEventListener(commentField: HTMLElement) {
    const listener = event => {
      if (event.key === 'Tab') {
        event.preventDefault();

        this.measurements.push(new FormGroup({
          species: new FormControl('', Validators.required),
          length: new FormControl('', Validators.required),
          weight: new FormControl('', Validators.required),
          amount: new FormControl('', Validators.required),
          gender: new FormControl('', Validators.required),
          lengthMeasurement: new FormControl('', Validators.required),
          comment: new FormControl('', Validators.required)
        }));

        commentField.removeEventListener('keydown', listener);
        this.hasListener = false;
      }
    }

    commentField.addEventListener('keydown', listener);
    this.hasListener = true;
  }
}

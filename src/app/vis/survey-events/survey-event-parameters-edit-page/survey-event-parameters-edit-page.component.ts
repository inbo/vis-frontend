import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Parameters} from '../../project/model/parameters';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-survey-event-parameters-edit-page',
  templateUrl: './survey-event-parameters-edit-page.component.html'
})
export class SurveyEventParametersEditPageComponent implements OnInit, OnDestroy {
  links: NavigationLink[] = GlobalConstants.links;

  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: 'Waterkwaliteitsparameters',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/waterkwaliteitsparameters'
    }
  ];
  private projectSubscription$: Subscription;
  private parametersSubscription$: Subscription;
  private updateSubscription$: Subscription;

  surveyEventId: any;

  parameters: Parameters;
  parametersForm: FormGroup;
  submitted: boolean;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder, private router: Router) {
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.titleService.setTitle('Bewerken waarneming waterkwaliteitsparameters ' + this.activatedRoute.snapshot.params.surveyEventId);

    this.parametersSubscription$ = this.visService.getParameters(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.snapshot.params.surveyEventId)
      .subscribe(value => {
        this.parameters = value;
      });

  }

  ngOnInit(): void {
    this.parametersForm = this.formBuilder.group(
      {
        oxygen: ['', []],
        oxygenPercentage: ['', []],
        averageDepth: ['', []],
        temperature: ['', []],
        conductivity: ['', []],
        ph: ['', []],
        flowRate: ['', []],
        turbidity: ['', []],
        turbidityOutOfRange: [false, []],
        secchi: ['', []],
        salinity: ['', []],
        width: ['', []]
      });

    this.visService.getParameters(this.activatedRoute.snapshot.params.projectCode, this.activatedRoute.snapshot.params.surveyEventId)
      .subscribe(value => {
        this.parameters = value;
        this.parametersForm.get('oxygen').patchValue(value.oxygen !== null ? value.oxygen.toString() : '');
        this.parametersForm.get('oxygenPercentage').patchValue(value.oxygenPercentage !== null ? value.oxygenPercentage.toString() : '');
        this.parametersForm.get('averageDepth').patchValue(value.averageDepth !== null ? value.averageDepth.toString() : '');
        this.parametersForm.get('temperature').patchValue(value.temperature !== null ? value.temperature.toString() : '');
        this.parametersForm.get('conductivity').patchValue(value.conductivity !== null ? value.conductivity.toString() : '');
        this.parametersForm.get('ph').patchValue(value.ph !== null ? value.ph.toString() : '');
        this.parametersForm.get('flowRate').patchValue(value.flowRate !== null ? value.flowRate.toString() : '');
        this.parametersForm.get('turbidity').patchValue(value.turbidity !== null ? value.turbidity.toString() : '');
        this.parametersForm.get('turbidityOutOfRange').patchValue(value.turbidityOutOfRange);
        this.parametersForm.get('secchi').patchValue(value.secchi !== null ? value.secchi.toString() : '');
        this.parametersForm.get('salinity').patchValue(value.salinity !== null ? value.salinity.toString() : '');
        this.parametersForm.get('width').patchValue(value.width !== null ? value.width.toString() : '');
      });
  }

  saveParameters() {
    this.submitted = true;
    if (this.parametersForm.invalid) {
      return;
    }

    const formData = this.parametersForm.getRawValue();

    this.updateSubscription$ = this.visService.updateParameters(this.activatedRoute.snapshot.params.projectCode.value, this.surveyEventId,
      formData).subscribe(() => {
        this.reset();
        this.router.navigate(['/projecten', this.activatedRoute.snapshot.params.projectCode, 'waarnemingen',
          this.activatedRoute.snapshot.params.surveyEventId, 'waterkwaliteitsparameters']).then();
      },
      (error) => console.log(error)
    );
  }

  reset() {
    this.submitted = false;

    this.parametersForm.get('oxygen').patchValue(this.parameters.oxygen !== null ? this.parameters.oxygen.toString() : '');
    this.parametersForm.get('oxygenPercentage').patchValue(this.parameters.oxygenPercentage !== null ?
      this.parameters.oxygenPercentage.toString() : '');
    this.parametersForm.get('averageDepth').patchValue(this.parameters.averageDepth !== null ?
      this.parameters.averageDepth.toString() : '');
    this.parametersForm.get('temperature').patchValue(this.parameters.temperature !== null ? this.parameters.temperature.toString() : '');
    this.parametersForm.get('conductivity').patchValue(this.parameters.conductivity !== null ?
      this.parameters.conductivity.toString() : '');
    this.parametersForm.get('ph').patchValue(this.parameters.ph !== null ? this.parameters.ph.toString() : '');
    this.parametersForm.get('flowRate').patchValue(this.parameters.flowRate !== null ? this.parameters.flowRate.toString() : '');
    this.parametersForm.get('turbidity').patchValue(this.parameters.turbidity !== null ? this.parameters.turbidity.toString() : '');
    this.parametersForm.get('turbidityOutOfRange').patchValue(this.parameters.turbidityOutOfRange);
    this.parametersForm.get('secchi').patchValue(this.parameters.secchi !== null ? this.parameters.secchi.toString() : '');
    this.parametersForm.get('salinity').patchValue(this.parameters.salinity !== null ? this.parameters.salinity.toString() : '');
    this.parametersForm.get('width').patchValue(this.parameters.width !== null ? this.parameters.width.toString() : '');
    this.parametersForm.reset(this.parametersForm.value);
  }


  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.parametersForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.parametersForm.dirty;
  }


  get oxygen() {
    return this.parametersForm.get('oxygen');
  }

  get oxygenPercentage() {
    return this.parametersForm.get('oxygenPercentage');
  }

  get averageDepth() {
    return this.parametersForm.get('averageDepth');
  }

  get temperature() {
    return this.parametersForm.get('temperature');
  }

  get conductivity() {
    return this.parametersForm.get('conductivity');
  }

  get ph() {
    return this.parametersForm.get('ph');
  }

  get flowRate() {
    return this.parametersForm.get('flowRate');
  }

  get turbidity() {
    return this.parametersForm.get('turbidity');
  }

  get turbidityOutOfRange() {
    return this.parametersForm.get('turbidityOutOfRange');
  }

  get secchi() {
    return this.parametersForm.get('secchi');
  }

  get salinity() {
    return this.parametersForm.get('salinity');
  }

  get width() {
    return this.parametersForm.get('width');
  }

  ngOnDestroy(): void {
    if (this.projectSubscription$ !== undefined) {
      this.projectSubscription$.unsubscribe();
    }
    if (this.parametersSubscription$ !== undefined) {
      this.parametersSubscription$.unsubscribe();
    }
    if (this.updateSubscription$ !== undefined) {
      this.updateSubscription$.unsubscribe();
    }
  }

  numberMask(scale: number, min: number, max: number) {
    return {
      mask: Number,
      scale,
      signed: true,
      thousandsSeparator: '',
      radix: ',',
      min,
      max
    };
  }

  outOfRangeChanged($event: Event) {
    if (($event.target as HTMLInputElement).checked) {
      this.parametersForm.get('turbidity').patchValue('');
    }
  }
}

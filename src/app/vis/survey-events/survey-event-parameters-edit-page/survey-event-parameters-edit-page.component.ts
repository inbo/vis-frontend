import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Parameters} from '../../../domain/survey-event/parameters';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';

@Component({
  selector: 'app-survey-event-parameters-edit-page',
  templateUrl: './survey-event-parameters-edit-page.component.html'
})
export class SurveyEventParametersEditPageComponent implements OnInit, OnDestroy {
  surveyEventId: any;

  parameters: Parameters;
  parametersForm: FormGroup;
  submitted: boolean;

  private subscription = new Subscription();

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder, private router: Router) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.titleService.setTitle('Bewerken waarneming waterkwaliteitsparameters ' + this.activatedRoute.parent.snapshot.params.surveyEventId);

    this.subscription.add(this.surveyEventsService.getParameters(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .subscribe(value => {
        this.parameters = value;
      }));
  }

  ngOnInit(): void {
    this.parametersForm = this.formBuilder.group(
      {
        oxygen: ['', []],
        oxygenPercentage: ['', []],
        minDepth: ['', []],
        maxDepth: ['', []],
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

    this.subscription.add(this.surveyEventsService.getParameters(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId).subscribe(value => {
      this.parameters = value;
      this.parametersForm.get('oxygen').patchValue(value.oxygen !== null ? value.oxygen.toString() : '');
      this.parametersForm.get('oxygenPercentage').patchValue(value.oxygenPercentage !== null ? value.oxygenPercentage.toString() : '');
      this.parametersForm.get('minDepth').patchValue(value.minDepth !== null ? value.minDepth.toString() : '');
      this.parametersForm.get('maxDepth').patchValue(value.maxDepth !== null ? value.maxDepth.toString() : '');
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
    }));
  }

  saveParameters() {
    this.submitted = true;
    if (this.parametersForm.invalid) {
      return;
    }

    const formData = this.parametersForm.getRawValue();

    this.subscription.add(
      this.surveyEventsService.updateParameters(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventId, formData)
        .subscribe(() => {
            this.reset();
            this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
              this.activatedRoute.parent.snapshot.params.surveyEventId, 'waterkwaliteitsparameters']).then();
          },
          (error) => console.log(error)
        )
    );
  }

  reset() {
    this.submitted = false;

    this.parametersForm.get('oxygen').patchValue(this.parameters.oxygen !== null ? this.parameters.oxygen.toString() : '');
    this.parametersForm.get('oxygenPercentage').patchValue(this.parameters.oxygenPercentage !== null ?
      this.parameters.oxygenPercentage.toString() : '');
    this.parametersForm.get('minDepth').patchValue(this.parameters.minDepth !== null ?
      this.parameters.minDepth.toString() : '');
    this.parametersForm.get('maxDepth').patchValue(this.parameters.maxDepth !== null ?
      this.parameters.maxDepth.toString() : '');
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

  get minDepth() {
    return this.parametersForm.get('minDepth');
  }

  get maxDepth() {
    return this.parametersForm.get('maxDepth');
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
    this.subscription.unsubscribe();
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

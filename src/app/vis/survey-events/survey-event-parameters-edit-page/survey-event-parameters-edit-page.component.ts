import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Parameters} from '../../../domain/survey-event/parameters';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {HasUnsavedData} from '../../../core/core.interface';
import {Location} from '@angular/common';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
  selector: 'vis-survey-event-parameters-edit-page',
  templateUrl: './survey-event-parameters-edit-page.component.html'
})
export class SurveyEventParametersEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {

  @ViewChild('distance') distanceInput: ElementRef;
  @ViewChild('time') timeInput: ElementRef;

  projectCode: string;
  surveyEventId: any;

  parameters: Parameters;
  parametersForm: UntypedFormGroup;

  submitted: boolean;
  private subscription = new Subscription();
  showFishingPointWidthWarning = false;
  fishingPointCode: string;
  isModalOpen = false;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private formBuilder: UntypedFormBuilder, private router: Router, private _location: Location) {
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
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
            this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
              this.activatedRoute.parent.snapshot.params.surveyEventId, 'waterkwaliteitsparameters']);
          },
          (error) => console.log(error)
        )
    );
  }

  cancel() {
    this._location.back();
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.parametersForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.parametersForm.dirty && !this.submitted;
  }

  @HostListener('window:beforeunload')
  hasUnsavedDataBeforeUnload(): any {
    // Return false when there is unsaved data to show a dialog
    return !this.hasUnsavedData();
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

  copyWidthFromFishingPoint() {
    this.subscription.add(
      this.surveyEventsService.getSurveyEvent(this.projectCode, this.surveyEventId)
        .subscribe(value => {
          if (value.fishingPoint?.width) {
            this.showFishingPointWidthWarning = false;
            this.width.patchValue(value.fishingPoint.width.toString());
          } else {
            this.showFishingPointWidthWarning = true;
            this.fishingPointCode = value.fishingPoint?.code;
          }
        })
    );
  }

  calculateAvgDepth() {
    if (isNumeric(this.minDepth.value) && isNumeric(this.maxDepth.value)) {
      const min = this.minDepth.value as number;
      const max = this.maxDepth.value as number;
      const sum = +min + +max;
      const avg = sum / 2;
      const value = Math.round( avg * 100 + Number.EPSILON ) / 100;
      this.averageDepth.patchValue(value.toString());
    }
  }

  openFlowRatePopup() {
    this.isModalOpen = true;
  }

  cancelModal() {
    this.isModalOpen = false;
  }

  confirmClicked() {
    this.calculateFlowRate();
  }

  private calculateFlowRate() {
    const distance = this.distanceInput.nativeElement.value as unknown as number;
    const time = this.timeInput.nativeElement.value as unknown as number;
    const value = Math.round( (distance / time) * 100 + Number.EPSILON ) / 100;
    this.flowRate.patchValue(value.toString());
    this.isModalOpen = false;
  }

}

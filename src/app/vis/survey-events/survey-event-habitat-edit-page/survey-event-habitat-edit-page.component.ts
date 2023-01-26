import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Habitat} from '../../../domain/survey-event/habitat';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {HabitatOptionsService} from '../habitat-options.service';
import {HasUnsavedData} from '../../../core/core.interface';
import {AlertService} from '../../../_alert';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-survey-event-habitat-edit-page',
  templateUrl: './survey-event-habitat-edit-page.component.html'
})
export class SurveyEventHabitatEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {
  surveyEventId: number;
  habitat: Habitat;
  habitatForm: UntypedFormGroup;
  submitted: boolean;

  private subscription = new Subscription();

  public numberMask: any = {
    mask: Number,
    scale: 1,
    signed: false,
    thousandsSeparator: '',
    radix: ',',
  };

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private formBuilder: UntypedFormBuilder, public habitatOptions: HabitatOptionsService, private alertService: AlertService,
              private router: Router, private _location: Location) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming habitat ' + this.activatedRoute.parent.snapshot.params.surveyEventId);

  }

  ngOnInit(): void {
    this.habitatForm = this.formBuilder.group(
      {
        soil: this.formBuilder.group({
          other: [false],
          grint: [false],
          clay: [false],
          mudd: [false],
          silt: [false],
          stones: [false],
          sand: [false],
          unknownSoil: [false]
        }),
        waterLevel: [null],
        shelters: [null],
        pool: [null],
        rapids: [null],
        creeks: [null],
        shore: [null],
        slope: [null],
        agriculture: [null],
        meadow: [null],
        trees: [null],
        buildings: [null],
        industry: [null],
        current: [null],
        fishPassage: [null],
        bottleneck: this.formBuilder.group({
          motorway: [false],
          diver: [false],
          mill: [false],
          undefined: [false],
          lock: [false],
          reservoir: [false],
          weir: [false],
          decay: [false],
          unknownBottleneck: [false]
        }),
        vegetation: this.formBuilder.group({
          threadAlgae: [false],
          filamentousAlgae: [false],
          soilWaterPlants: [false],
          unknownVegetation: [false]
        })
      });

    this.subscription.add(this.surveyEventsService.getHabitat(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventId)
      .subscribe(value => {
        this.habitat = value;
        this.habitatForm.get('waterLevel').patchValue(value.waterLevel);
        this.habitatForm.get('shelters').patchValue(value.shelters);
        this.habitatForm.get('pool').patchValue(value.pool);
        this.habitatForm.get('rapids').patchValue(value.rapids);
        this.habitatForm.get('creeks').patchValue(value.creeks);
        this.habitatForm.get('shore').patchValue(value.shore);
        this.habitatForm.get('slope').patchValue(value.slope);
        this.habitatForm.get('agriculture').patchValue(value.agriculture);
        this.habitatForm.get('meadow').patchValue(value.meadow);
        this.habitatForm.get('trees').patchValue(value.trees);
        this.habitatForm.get('buildings').patchValue(value.buildings);
        this.habitatForm.get('industry').patchValue(value.industry);
        this.habitatForm.get('fishPassage').patchValue(value.fishPassage);
        this.habitatForm.get('current').patchValue(value.current);

        this.habitatForm.get('soil').get('other').patchValue(value.soil.other);
        this.habitatForm.get('soil').get('grint').patchValue(value.soil.grint);
        this.habitatForm.get('soil').get('clay').patchValue(value.soil.clay);
        this.habitatForm.get('soil').get('mudd').patchValue(value.soil.mudd);
        this.habitatForm.get('soil').get('silt').patchValue(value.soil.silt);
        this.habitatForm.get('soil').get('stones').patchValue(value.soil.stones);
        this.habitatForm.get('soil').get('sand').patchValue(value.soil.sand);
        this.habitatForm.get('soil').get('unknownSoil').patchValue(value.soil.unknown);
        if (value.soil.unknown) {
          this.disableSoil();
        }

        this.habitatForm.get('bottleneck').get('motorway').patchValue(value.bottleneck.motorway);
        this.habitatForm.get('bottleneck').get('diver').patchValue(value.bottleneck.diver);
        this.habitatForm.get('bottleneck').get('mill').patchValue(value.bottleneck.mill);
        this.habitatForm.get('bottleneck').get('undefined').patchValue(value.bottleneck.undefined);
        this.habitatForm.get('bottleneck').get('lock').patchValue(value.bottleneck.lock);
        this.habitatForm.get('bottleneck').get('reservoir').patchValue(value.bottleneck.reservoir);
        this.habitatForm.get('bottleneck').get('weir').patchValue(value.bottleneck.weir);
        this.habitatForm.get('bottleneck').get('decay').patchValue(value.bottleneck.decay);
        this.habitatForm.get('bottleneck').get('unknownBottleneck').patchValue(value.bottleneck.unknown);
        if (value.bottleneck.unknown) {
          this.disableBottleneck();
        }

        this.habitatForm.get('vegetation').get('threadAlgae').patchValue(value.vegetation.threadAlgae);
        this.habitatForm.get('vegetation').get('filamentousAlgae').patchValue(value.vegetation.filamentousAlgae);
        this.habitatForm.get('vegetation').get('soilWaterPlants').patchValue(value.vegetation.soilWaterPlants);
        this.habitatForm.get('vegetation').get('unknownVegetation').patchValue(value.vegetation.unknown);
        if (value.vegetation.unknown) {
          this.disableVegetation();
        }
      }));
  }

  saveHabitat() {
    this.submitted = true;
    if (this.habitatForm.invalid) {
      return;
    }

    const formData = this.habitatForm.getRawValue();
    formData.soil.unknown = formData.soil.unknownSoil;
    formData.bottleneck.unknown = formData.bottleneck.unknownBottleneck;
    formData.vegetation.unknown = formData.vegetation.unknownVegetation;

    this.subscription.add(
      this.surveyEventsService.updateHabitat(this.activatedRoute.parent.snapshot.params.projectCode, this.surveyEventId, formData)
        .subscribe(() => {

          this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
            this.activatedRoute.parent.snapshot.params.surveyEventId, 'habitat']);
        })
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.habitatForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.habitatForm.dirty && !this.submitted;
  }

  @HostListener('window:beforeunload')
  hasUnsavedDataBeforeUnload(): any {
    // Return false when there is unsaved data to show a dialog
    return !this.hasUnsavedData();
  }

  cancel() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get soils() {
    return this.habitatForm.get('soils');
  }

  get waterLevel() {
    return this.habitatForm.get('waterLevel');
  }

  get shelters() {
    return this.habitatForm.get('shelters');
  }

  get pool() {
    return this.habitatForm.get('pool');
  }

  get rapids() {
    return this.habitatForm.get('rapids');
  }

  get creeks() {
    return this.habitatForm.get('creeks');
  }

  get shore() {
    return this.habitatForm.get('shore');
  }

  get slope() {
    return this.habitatForm.get('slope');
  }

  get agriculture() {
    return this.habitatForm.get('agriculture');
  }

  get meadow() {
    return this.habitatForm.get('meadow');
  }

  get trees() {
    return this.habitatForm.get('trees');
  }

  get buildings() {
    return this.habitatForm.get('buildings');
  }

  get industry() {
    return this.habitatForm.get('industry');
  }

  get current() {
    return this.habitatForm.get('current');
  }

  get fishPassage() {
    return this.habitatForm.get('fishPassage');
  }

  get bottlenecks() {
    return this.habitatForm.get('bottlenecks');
  }

  get vegetations() {
    return this.habitatForm.get('vegetations');
  }

  soilChecked($event: any) {
    if ($event.option === 'unknownSoil') {
      if ($event.checked) {
        this.disableSoil();
      } else {
        this.enableSoil();
      }
    }
  }

  bottleneckChecked($event: any) {
    if ($event.option === 'unknownBottleneck') {
      if ($event.checked) {
        this.disableBottleneck();
      } else {
        this.enableBottleneck();
      }
    }
  }

  vegetationChecked($event: any) {
    if ($event.option === 'unknownVegetation') {
      if ($event.checked) {
        this.disableVegetation();
      } else {
        this.enableVegetation();
      }
    }
  }

  private disableSoil() {
    this.habitatForm.get('soil').get('other').patchValue(false);
    this.habitatForm.get('soil').get('other').disable();
    this.habitatForm.get('soil').get('grint').patchValue(false);
    this.habitatForm.get('soil').get('grint').disable();
    this.habitatForm.get('soil').get('clay').patchValue(false);
    this.habitatForm.get('soil').get('clay').disable();
    this.habitatForm.get('soil').get('mudd').patchValue(false);
    this.habitatForm.get('soil').get('mudd').disable();
    this.habitatForm.get('soil').get('silt').patchValue(false);
    this.habitatForm.get('soil').get('silt').disable();
    this.habitatForm.get('soil').get('stones').patchValue(false);
    this.habitatForm.get('soil').get('stones').disable();
    this.habitatForm.get('soil').get('sand').patchValue(false);
    this.habitatForm.get('soil').get('sand').disable();
  }

  private enableSoil() {
    this.habitatForm.get('soil').get('other').enable();
    this.habitatForm.get('soil').get('grint').enable();
    this.habitatForm.get('soil').get('clay').enable();
    this.habitatForm.get('soil').get('mudd').enable();
    this.habitatForm.get('soil').get('silt').enable();
    this.habitatForm.get('soil').get('stones').enable();
    this.habitatForm.get('soil').get('sand').enable();
  }

  private disableBottleneck() {
    this.habitatForm.get('bottleneck').get('motorway').patchValue(false);
    this.habitatForm.get('bottleneck').get('motorway').disable();
    this.habitatForm.get('bottleneck').get('diver').patchValue(false);
    this.habitatForm.get('bottleneck').get('diver').disable();
    this.habitatForm.get('bottleneck').get('mill').patchValue(false);
    this.habitatForm.get('bottleneck').get('mill').disable();
    this.habitatForm.get('bottleneck').get('undefined').patchValue(false);
    this.habitatForm.get('bottleneck').get('undefined').disable();
    this.habitatForm.get('bottleneck').get('lock').patchValue(false);
    this.habitatForm.get('bottleneck').get('lock').disable();
    this.habitatForm.get('bottleneck').get('reservoir').patchValue(false);
    this.habitatForm.get('bottleneck').get('reservoir').disable();
    this.habitatForm.get('bottleneck').get('weir').patchValue(false);
    this.habitatForm.get('bottleneck').get('weir').disable();
    this.habitatForm.get('bottleneck').get('decay').patchValue(false);
    this.habitatForm.get('bottleneck').get('decay').disable();
  }

  private enableBottleneck() {
    this.habitatForm.get('bottleneck').get('motorway').enable();
    this.habitatForm.get('bottleneck').get('diver').enable();
    this.habitatForm.get('bottleneck').get('mill').enable();
    this.habitatForm.get('bottleneck').get('undefined').enable();
    this.habitatForm.get('bottleneck').get('lock').enable();
    this.habitatForm.get('bottleneck').get('reservoir').enable();
    this.habitatForm.get('bottleneck').get('weir').enable();
    this.habitatForm.get('bottleneck').get('decay').enable();
  }

  private disableVegetation() {
    this.habitatForm.get('vegetation').get('threadAlgae').patchValue(false);
    this.habitatForm.get('vegetation').get('threadAlgae').disable();
    this.habitatForm.get('vegetation').get('filamentousAlgae').patchValue(false);
    this.habitatForm.get('vegetation').get('filamentousAlgae').disable();
    this.habitatForm.get('vegetation').get('soilWaterPlants').patchValue(false);
    this.habitatForm.get('vegetation').get('soilWaterPlants').disable();
  }

  private enableVegetation() {
    this.habitatForm.get('vegetation').get('threadAlgae').enable();
    this.habitatForm.get('vegetation').get('filamentousAlgae').enable();
    this.habitatForm.get('vegetation').get('soilWaterPlants').enable();
  }
}

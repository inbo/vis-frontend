import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Habitat} from '../../../domain/survey-event/habitat';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  habitatForm: FormGroup;
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
              private formBuilder: FormBuilder, public habitatOptions: HabitatOptionsService, private alertService: AlertService,
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
          waterplants: [false],
          sand: [false]
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
          decay: [false]
        }),
        vegetation: this.formBuilder.group({
          threadAlgae: [false],
          filamentousAlgae: [false]
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
        // this.habitatForm.get('soil').patchValue(value.soil);
        // this.habitatForm.get('bottleneck').patchValue(value.bottleneck);
        // this.habitatForm.get('vegetation').patchValue(value.vegetation);
      }));
  }

  saveHabitat() {
    this.submitted = true;
    if (this.habitatForm.invalid) {
      return;
    }

    const formData = this.habitatForm.getRawValue();

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
}

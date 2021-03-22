import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Habitat} from '../model/habitat';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HabitatOptionsService} from '../habitat-options.service';
import {HasUnsavedData} from '../../../core/core.interface';
import {AlertService} from '../../../_alert';

@Component({
  selector: 'app-survey-event-habitat-edit-page',
  templateUrl: './survey-event-habitat-edit-page.component.html'
})
export class SurveyEventHabitatEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: 'ID: ' + this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: 'Habitat',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/habitat'
    }
  ];

  surveyEventId: any;
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

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder, public habitatOptions: HabitatOptionsService, private alertService: AlertService) {
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming habitat ' + this.activatedRoute.snapshot.params.surveyEventId);

  }

  ngOnInit(): void {
    this.habitatForm = this.formBuilder.group(
      {
        soils: [null],
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
        loop: [null],
        bottlenecks: [null],
        vegetations: [null],
      });

    this.subscription.add(this.visService.getHabitat(this.activatedRoute.snapshot.params.projectCode, this.surveyEventId)
      .subscribe(value => {
        this.habitat = value;
        this.habitatForm.get('soils').patchValue(value.soils);
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
        this.habitatForm.get('loop').patchValue(value.loop);
        this.habitatForm.get('bottlenecks').patchValue(value.bottlenecks);
        this.habitatForm.get('vegetations').patchValue(value.vegetations);
      }));
  }

  saveHabitat() {
    this.submitted = true;
    if (this.habitatForm.invalid) {
      return;
    }

    const formData = this.habitatForm.getRawValue();

    this.subscription.add(this.visService.updateHabitat(this.activatedRoute.snapshot.params.projectCode, this.surveyEventId, formData)
      .subscribe((response) => {
        this.alertService.success('Succesvol bewaard', '');
        this.habitat = response;
        this.habitatForm.get('soils').patchValue(response.soils);
        this.habitatForm.get('waterLevel').patchValue(response.waterLevel);
        this.habitatForm.get('shelters').patchValue(response.shelters);
        this.habitatForm.get('pool').patchValue(response.pool);
        this.habitatForm.get('rapids').patchValue(response.rapids);
        this.habitatForm.get('creeks').patchValue(response.creeks);
        this.habitatForm.get('shore').patchValue(response.shore);
        this.habitatForm.get('slope').patchValue(response.slope);
        this.habitatForm.get('agriculture').patchValue(response.agriculture);
        this.habitatForm.get('meadow').patchValue(response.meadow);
        this.habitatForm.get('trees').patchValue(response.trees);
        this.habitatForm.get('buildings').patchValue(response.buildings);
        this.habitatForm.get('industry').patchValue(response.industry);
        this.habitatForm.get('loop').patchValue(response.loop);
        this.habitatForm.get('bottlenecks').patchValue(response.bottlenecks);
        this.habitatForm.get('vegetations').patchValue(response.vegetations);
        this.habitatForm.reset(this.habitatForm.value);
      }));
  }

  reset() {
    this.submitted = false;


    this.habitatForm.get('soils').patchValue(this.habitat.soils);
    this.habitatForm.get('waterLevel').patchValue(this.habitat.waterLevel);
    this.habitatForm.get('shelters').patchValue(this.habitat.shelters);
    this.habitatForm.get('pool').patchValue(this.habitat.pool);
    this.habitatForm.get('rapids').patchValue(this.habitat.rapids);
    this.habitatForm.get('creeks').patchValue(this.habitat.creeks);
    this.habitatForm.get('shore').patchValue(this.habitat.shore);
    this.habitatForm.get('slope').patchValue(this.habitat.slope);
    this.habitatForm.get('agriculture').patchValue(this.habitat.agriculture);
    this.habitatForm.get('meadow').patchValue(this.habitat.meadow);
    this.habitatForm.get('trees').patchValue(this.habitat.trees);
    this.habitatForm.get('buildings').patchValue(this.habitat.buildings);
    this.habitatForm.get('industry').patchValue(this.habitat.industry);
    this.habitatForm.get('loop').patchValue(this.habitat.loop);
    this.habitatForm.get('bottlenecks').patchValue(this.habitat.bottlenecks);
    this.habitatForm.get('vegetations').patchValue(this.habitat.vegetations);
    this.habitatForm.reset(this.habitatForm.value);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.habitatForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.habitatForm.dirty;
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

  get loop() {
    return this.habitatForm.get('loop');
  }

  get bottlenecks() {
    return this.habitatForm.get('bottlenecks');
  }

  get vegetations() {
    return this.habitatForm.get('vegetations');
  }
}

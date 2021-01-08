import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../project/model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Habitat} from "../model/habitat";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HabitatOptionsService} from "../habitat-options.service";
import {HasUnsavedData} from "../../core/core.interface";
import {AlertService} from "../../_alert";

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
    {title: this.activatedRoute.snapshot.params.surveyEventId, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.surveyEventId},
    {title: 'Habitat', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/' + this.activatedRoute.snapshot.params.surveyEventId + '/habitat'}
  ]

  project: Project;
  surveyEventId: any;
  private projectSubscription$: Subscription;
  private habitatSubscription$: Subscription;
  habitat: Habitat;
  habitatForm: FormGroup;
  submitted: boolean;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public habitatOptions: HabitatOptionsService, private alertService: AlertService) {
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming habitat ' + this.activatedRoute.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
    this.habitatForm = this.formBuilder.group(
      {
        waterLevel: [null],
        shelters: [null],
        shore: [null],
        slope: [null],
        agriculture: [null],
        meadow: [null],
        trees: [null],
        buildings: [null],
        industry: [null],
        loop: [null],
        soils: [null],
        bottlenecks: [null],
        vegetations: [null],
      });

    this.projectSubscription$ = this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
      this.project = value
      this.habitatSubscription$ = this.visService.getHabitat(this.project.code.value, this.surveyEventId).subscribe(value1 => {
        this.habitat = value1;
        this.habitatForm.get('waterLevel').patchValue(value1.waterLevel);
        this.habitatForm.get('shelters').patchValue(value1.shelters);
        this.habitatForm.get('shore').patchValue(value1.shore);
        this.habitatForm.get('slope').patchValue(value1.slope);
        this.habitatForm.get('agriculture').patchValue(value1.agriculture);
        this.habitatForm.get('meadow').patchValue(value1.meadow);
        this.habitatForm.get('trees').patchValue(value1.trees);
        this.habitatForm.get('buildings').patchValue(value1.buildings);
        this.habitatForm.get('industry').patchValue(value1.industry);
        this.habitatForm.get('loop').patchValue(value1.loop);
        this.habitatForm.get('soils').patchValue(value1.soils);
        this.habitatForm.get('bottlenecks').patchValue(value1.bottlenecks);
        this.habitatForm.get('vegetations').patchValue(value1.vegetations);
      });
    });
  }

  saveHabitat() {
    this.submitted = true;
    if (this.habitatForm.invalid) {
      return;
    }

    const formData = this.habitatForm.getRawValue();

    this.visService.updateHabitat(this.project.code.value, this.surveyEventId, formData).subscribe(
      (response) => {
        this.alertService.success("Succesvol bewaard", "");
        this.habitat = response;
        this.habitatForm.get('waterLevel').patchValue(response.waterLevel);
        this.habitatForm.get('shelters').patchValue(response.shelters);
        this.habitatForm.get('shore').patchValue(response.shore);
        this.habitatForm.get('slope').patchValue(response.slope);
        this.habitatForm.get('agriculture').patchValue(response.agriculture);
        this.habitatForm.get('meadow').patchValue(response.meadow);
        this.habitatForm.get('trees').patchValue(response.trees);
        this.habitatForm.get('buildings').patchValue(response.buildings);
        this.habitatForm.get('industry').patchValue(response.industry);
        this.habitatForm.get('loop').patchValue(response.loop);
        this.habitatForm.get('soils').patchValue(response.soils);
        this.habitatForm.get('bottlenecks').patchValue(response.bottlenecks);
        this.habitatForm.get('vegetations').patchValue(response.vegetations);
        this.habitatForm.reset(this.habitatForm.value)
      }
    );
  }

  reset() {
    this.submitted = false;

    this.habitatForm.get('waterLevel').patchValue(this.habitat.waterLevel);
    this.habitatForm.get('shelters').patchValue(this.habitat.shelters);
    this.habitatForm.get('shore').patchValue(this.habitat.shore);
    this.habitatForm.get('slope').patchValue(this.habitat.slope);
    this.habitatForm.get('agriculture').patchValue(this.habitat.agriculture);
    this.habitatForm.get('meadow').patchValue(this.habitat.meadow);
    this.habitatForm.get('trees').patchValue(this.habitat.trees);
    this.habitatForm.get('buildings').patchValue(this.habitat.buildings);
    this.habitatForm.get('industry').patchValue(this.habitat.industry);
    this.habitatForm.get('loop').patchValue(this.habitat.loop);
    this.habitatForm.get('soils').patchValue(this.habitat.soils);
    this.habitatForm.get('bottlenecks').patchValue(this.habitat.bottlenecks);
    this.habitatForm.get('vegetations').patchValue(this.habitat.vegetations);
    this.habitatForm.reset(this.habitatForm.value)
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.habitatForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.habitatForm.dirty
  }

  ngOnDestroy(): void {
    this.projectSubscription$.unsubscribe();
    this.habitatSubscription$.unsubscribe();
  }

  get waterLevel() {
    return this.habitatForm.get('waterLevel');
  }

  get shelters() {
    return this.habitatForm.get('shelters');
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

  get soils() {
    return this.habitatForm.get('soils');
  }

  get bottlenecks() {
    return this.habitatForm.get('bottlenecks');
  }

  get vegetations() {
    return this.habitatForm.get('vegetations');
  }

}

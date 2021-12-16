import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {HasUnsavedData} from '../../../core/core.interface';
import {EMPTY, Observable, Subscription} from 'rxjs';
import {ProjectService} from '../../../services/vis.project.service';
import {Role} from '../../../core/_models/role';
import {AccountService} from '../../../services/vis.account.service';
import {map, take} from 'rxjs/operators';
import {MultiSelectOption} from '../../../shared-ui/multi-select/multi-select';
import {Location} from '@angular/common';
import {DatepickerComponent} from '../../../shared-ui/datepicker/datepicker.component';
import {PicturesService} from '../../../services/vis.pictures.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';

function projectStartBeforeSurveyEvents(date: Date): ValidatorFn {
  return (c: AbstractControl) => {
    if (date && (new Date(date).valueOf() < new Date(c.value).valueOf())) {
      return {projectStartAfterSurveyEvents: true};
    }

    return null;
  };
}

function projectEndAfterSurveyEvents(date: Date): ValidatorFn {
  return (c: AbstractControl) => {
    if (date && (new Date(c.value).valueOf() < new Date(date).valueOf())) {
      return {projectEndBeforeSurveyEvents: true};
    }

    return null;
  };
}

@Component({
  selector: 'app-project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {

  @ViewChild('startDatePicker') startDatePicker: DatepickerComponent;
  @ViewChild('endDatePicker') endDatePicker: DatepickerComponent;

  public role = Role;

  closeProjectForm: FormGroup;
  projectForm: FormGroup;
  project: Project;
  submitted: boolean;
  closeProjectFormSubmitted: boolean;
  earliestSurveyEventDate: Date;
  latestSurveyEventDate: Date;

  showCloseProjectModal = false;

  teams$: Observable<MultiSelectOption[]>;
  instances$: Observable<MultiSelectOption[]>;

  private subscription = new Subscription();
  tandemVaultCollections: SearchableSelectOption[] = [];
  tandemVaultCollectionsFiltered: SearchableSelectOption[] = [];
  loadingCollections = true;
  isModalOpen = false;

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder, private accountService: AccountService,
              private _location: Location, private pictureService: PicturesService) {

  }

  ngOnInit(): void {
    this.instances$ = this.accountService.listInstances().pipe(map(values => values.map(value => {
      return {value: value.code, displayValue: value.code};
    })));

    this.teams$ = this.accountService.listTeams().pipe(map(values => values.map(value => {
      return {value: value.name, displayValue: value.name};
    })));

    this.closeProjectForm = this.formBuilder.group({
      endDate: [null, [Validators.required]]
    });

    this.projectForm = this.formBuilder.group(
      {
        code: [null, [Validators.required, Validators.maxLength(15)], [this.codeValidator()]],
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        lengthType: ['', [Validators.required]],
        startDate: [null, [Validators.required]],
        contact: [''],
        tandemvaultcollectionslug: [null, [Validators.maxLength(255)]],
        teams: [[]],
        instances: [[]],
      });

    this.projectService.getEarliestSurveyEventOccurrenceDate(this.activatedRoute.parent.snapshot.params.projectCode)
      .pipe(take(1))
      .subscribe(date => {
        this.earliestSurveyEventDate = date;
        if (date) {
          this.startDate.setValidators([Validators.required, projectStartBeforeSurveyEvents(date)]);
          this.startDatePicker.setMaxDate(new Date(date));
        }
      });

    this.projectService.getLatestSurveyEventOccurrenceDate(this.activatedRoute.parent.snapshot.params.projectCode)
      .pipe(take(1))
      .subscribe(date => {
        this.latestSurveyEventDate = date;
        if (date) {
          this.endDate.setValidators([Validators.required, projectEndAfterSurveyEvents(date)]);
          this.endDatePicker.setMinDate(new Date(date));
        }
      });
    this.loadData();
  }

  private loadData() {
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode).subscribe((value: Project) => {
        this.titleService.setTitle(value.name);

        this.project = value;
        this.projectForm.get('code').patchValue(value.code?.value);
        this.projectForm.get('name').patchValue(value.name);
        this.projectForm.get('description').patchValue(value.description);
        // Don't set start date if it is after earliest survey event date to show datepicker correctly
        if (this.earliestSurveyEventDate == null || (new Date(this.earliestSurveyEventDate) >= new Date(value.start))) {
          this.projectForm.get('startDate').patchValue(new Date(value.start));
        }
        this.projectForm.get('lengthType').patchValue(value.lengthType);
        this.projectForm.get('contact').patchValue(value.contact);
        this.projectForm.get('teams').patchValue(value.teams === undefined ? [] : value.teams);
        this.projectForm.get('instances').patchValue(value.instances === undefined ? [] : value.instances);
        this.projectForm.get('tandemvaultcollectionslug').patchValue(value.tandemvaultcollectionslug);

        this.pictureService.allCollections().pipe(
          map(tandemvaultCollection => {
            return tandemvaultCollection.map(collection => ({
              selectValue: collection.slug,
              option: collection
            }));
          })
        ).subscribe(v => {
          this.tandemVaultCollections = v as any as SearchableSelectOption[];
          this.tandemVaultCollectionsFiltered = v as any as SearchableSelectOption[];
          this.loadingCollections = false;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.pristine) {
        return EMPTY;
      }
      return this.projectService.checkIfProjectExists(control.value)
        .pipe(map(result => result.valid ? {uniqueCode: true} : null));
    };
  }

  getCollections($event: string) {
    if ($event === '') {
      this.tandemVaultCollectionsFiltered = this.tandemVaultCollections;
    }
    this.tandemVaultCollectionsFiltered = this.tandemVaultCollections.filter(value => value.option.name_with_hierarchy.toLowerCase().includes($event.toLowerCase()));
  }

  saveProject() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }

    const formData = this.projectForm.getRawValue();

    this.subscription.add(
      this.projectService.updateProject(this.project.code.value, formData).subscribe(
        (response) => {
          this.project = response;
          this.projectForm.reset();
          this.projectService.next(response);
          this.router.navigate(['/projecten', this.project.code.value]).then();
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
    if (this.projectForm.dirty) {
      $event.returnValue = true;
    }
  }

  closeProject() {
    this.closeProjectFormSubmitted = true;

    if (this.closeProjectForm.invalid) {
      return;
    }

    this.subscription.add(this.projectService.closeProject(this.activatedRoute.parent.snapshot.params.projectCode,
        this.closeProjectForm.getRawValue()).subscribe(value => {
          this.projectService.next(value);
          this.router.navigateByUrl(`/projecten/${this.activatedRoute.parent.snapshot.params.projectCode}`);
        }
      )
    );
  }

  hasUnsavedData(): boolean {
    return this.projectForm.dirty && !this.submitted;
  }

  @HostListener('window:beforeunload')
  hasUnsavedDataBeforeUnload(): any {
    // Return false when there is unsaved data to show a dialog
    return !this.hasUnsavedData();
  }

  get code() {
    return this.projectForm.get('code');
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.closeProjectForm.get('endDate');
  }

  get lengthType() {
    return this.projectForm.get('lengthType');
  }

  get teams() {
    return this.projectForm.get('teams');
  }

  get instances() {
    return this.projectForm.get('instances');
  }

  get tandemvaultcollectionslug() {
    return this.projectForm.get('tandemvaultcollectionslug');
  }

  reloadCollections() {
    if (this.loadingCollections) {
      return;
    }

    this.loadingCollections = true;

    this.pictureService.reloadCollections().pipe(
      map(fishingPoints => {
        return fishingPoints.map(collection => ({
          selectValue: collection.slug,
          option: collection
        }));
      })
    ).subscribe(value => {
      this.tandemVaultCollections = value as any as SearchableSelectOption[];
      this.tandemVaultCollectionsFiltered = value as any as SearchableSelectOption[];
      this.loadingCollections = false;
    });
  }

  cancelModal() {
    this.isModalOpen = false;
  }

  confirmClicked() {
    this.pictureService.createCollectionForProject(this.project.code.value)
      .subscribe(value => this.router.navigate(['/projecten', this.project.code.value]).then());
    this.isModalOpen = false;
  }
}

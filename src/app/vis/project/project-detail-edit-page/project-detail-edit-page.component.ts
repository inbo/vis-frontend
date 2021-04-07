import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HasUnsavedData} from '../../../core/core.interface';
import {Subscription} from 'rxjs';
import {ProjectService} from '../../../services/vis.project.service';
import {Role} from '../../../core/_models/role';

@Component({
  selector: 'app-project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {
  public role = Role;

  closeProjectForm: FormGroup;
  projectForm: FormGroup;
  project: Project;
  submitted: boolean;
  closeProjectFormSubmitted: boolean;

  showCloseProjectModal = false;

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.closeProjectForm = this.formBuilder.group({
      endDate: [null, [Validators.required]]
    });

    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        status: [false, []],
        startDate: [null, [Validators.required]],
      });

    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode).subscribe((value: Project) => {
        this.titleService.setTitle(value.name);
        this.project = value;
        this.projectForm.get('name').patchValue(value.name);
        this.projectForm.get('description').patchValue(value.description);
        this.projectForm.get('status').patchValue(value.status === 'ACTIVE');
        this.projectForm.get('startDate').patchValue(value.start);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
          this.reset();
          this.router.navigate(['/projecten', this.project.code.value]).then();
        },
        (error) => console.log(error)
      )
    );
  }

  reset() {
    this.submitted = false;

    this.projectForm.get('name').patchValue(this.project.name);
    this.projectForm.get('description').patchValue(this.project.description);
    this.projectForm.get('status').patchValue(this.project.status === 'ACTIVE');
    this.projectForm.get('startDate').patchValue(this.project.start);
    this.projectForm.reset(this.projectForm.value);
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
      this.closeProjectForm.getRawValue()).subscribe(() =>
        this.router.navigateByUrl(`/projecten/${this.activatedRoute.parent.snapshot.params.projectCode}`)
      )
    );
  }

  hasUnsavedData(): boolean {
    return this.projectForm.dirty;
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get status() {
    return this.projectForm.get('status');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.closeProjectForm.get('endDate');
  }
}

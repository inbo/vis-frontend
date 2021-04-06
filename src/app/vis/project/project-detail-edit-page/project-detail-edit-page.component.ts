import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HasUnsavedData} from '../../../core/core.interface';
import {Subscription} from 'rxjs';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit, OnDestroy, HasUnsavedData {
  projectForm: FormGroup;
  project: Project;
  submitted: boolean;

  private subscription = new Subscription();

  constructor(private titleService: Title, private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        lengthType: ['', [Validators.required]],
        status: [false, []],
        period: [null, [Validators.required]],
      });

    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode).subscribe((value: Project) => {
        this.titleService.setTitle(value.name);
        this.project = value;
        this.projectForm.get('name').patchValue(value.name);
        this.projectForm.get('description').patchValue(value.description);
        this.projectForm.get('status').patchValue(value.status === 'ACTIVE');
        this.projectForm.get('period').patchValue([new Date(value.start), new Date(value.end)]);
        this.projectForm.get('lengthType').patchValue(value.lengthType);
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
    this.projectForm.get('period').patchValue([new Date(this.project.start), new Date(this.project.end)]);
    this.projectForm.get('lengthType').patchValue(this.project.lengthType);
    this.projectForm.reset(this.projectForm.value);
  }


  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.projectForm.dirty) {
      $event.returnValue = true;
    }
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

  get period() {
    return this.projectForm.get('period');
  }

  get lengthType() {
    return this.projectForm.get('lengthType');
  }
}

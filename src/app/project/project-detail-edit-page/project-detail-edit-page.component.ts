import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HasUnsavedData} from "../../core/core.interface";

@Component({
  selector: 'project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit, HasUnsavedData {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Bewerk', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/edit'}
  ]

  projectForm: FormGroup;
  project: Project;
  submitted: boolean;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        status: [false, []],
        period: [null, [Validators.required]],
      });

    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe((value: Project) => {
      this.titleService.setTitle(value.name)
      this.project = value;
      this.projectForm.get('name').patchValue(value.name);
      this.projectForm.get('description').patchValue(value.description);
      this.projectForm.get('status').patchValue(value.status === 'ACTIVE');
      this.projectForm.get('period').patchValue([new Date(value.start), new Date(value.end)]);
    });
  }

  saveProject() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }

    const formData = this.projectForm.getRawValue();

    this.visService.updateProject(this.project.code.value, formData).subscribe(
      (response) => {
        this.project = response;
        this.reset();
        this.router.navigate(['/projecten', this.project.code.value])
      },
      (error) => console.log(error)
    );
  }

  reset() {
    this.submitted = false;

    this.projectForm.get('name').patchValue(this.project.name);
    this.projectForm.get('description').patchValue(this.project.description);
    this.projectForm.get('status').patchValue(this.project.status === 'ACTIVE');
    this.projectForm.get('period').patchValue([new Date(this.project.start), new Date(this.project.end)]);
    this.projectForm.reset(this.projectForm.value)
  }


  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.projectForm.dirty) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    return this.projectForm.dirty
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
}

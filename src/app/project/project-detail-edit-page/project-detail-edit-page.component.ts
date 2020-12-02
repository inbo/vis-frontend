import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'project-detail-edit-page',
  templateUrl: './project-detail-edit-page.component.html'
})
export class ProjectDetailEditPageComponent implements OnInit {
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
  isSuccessNotificationOpen: boolean;

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(2000)]],
        status: [false, []],
        start: [null, [Validators.required]],
        end: [null, [Validators.required]],
      });

    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe((value: Project) => {
      this.titleService.setTitle(value.name)
      this.project = value;
      this.projectForm.get('name').patchValue(value.name);
      this.projectForm.get('description').patchValue(value.description);
      this.projectForm.get('status').patchValue(value.status === 'ACTIVE');
      this.projectForm.get('start').patchValue(new Date(value.start));
      this.projectForm.get('end').patchValue(new Date(value.end));
    });
  }

  saveProject() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    }

    const formData = {...this.projectForm.getRawValue(), code: this.project.code.value};

    this.visService.updateProject(this.project.code.value, formData).subscribe(
      (response) => {
        this.isSuccessNotificationOpen = true;
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
    this.projectForm.get('start').patchValue(new Date(this.project.start));
    this.projectForm.get('end').patchValue(new Date(this.project.end));
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

  get start() {
    return this.projectForm.get('start');
  }

  get end() {
    return this.projectForm.get('end');
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {VisService} from "../../vis.service";
import {Router} from "@angular/router";

@Component({
  selector: 'project-add',
  templateUrl: './project-add.component.html'
})
export class ProjectAddComponent implements OnInit {

  createProjectForm: FormGroup;
  isOpen = false;

  submitted: boolean;

  constructor(private visService: VisService, private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    // this.createPersonForm = this.formBuilder.group({
    //   id: [null],
    //   lastName: [null, [Validators.required]],
    //   firstName: [null, [Validators.required]],
    //   userName: [null, [Validators.required]],
    //   email: [null, [Validators.email]],
    //   phone: '',
    //   streetInfo: '',
    //   postalCode: '',
    //   city: '',
    //   active: false,
    //   comment: [null, [Validators.maxLength(255)]]
    // });
  }

  open() {
    this.isOpen = true;
  }

  createPerson() {
    this.submitted = true;

    // if (this.createPersonForm.invalid) {
    //   return;
    // }
    //
    // const formData = {personDto: this.createPersonForm.getRawValue()};
    // formData.personDto.startDate = new Date();
    // this.waterbirdsService.postCreatePerson(formData).subscribe(
    //   (response) => {
    //     this.isAddPersonOpen = false;
    //     this.router.navigateByUrl('/v2/people/' + response.id);
    //   },
    //   (error) => console.log(error)
    // );
  }

  cancel() {
    this.isOpen = false;
    this.submitted = false;
  }
}

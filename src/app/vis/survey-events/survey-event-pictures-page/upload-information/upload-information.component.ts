import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-upload-information',
  templateUrl: './upload-information.component.html'
})
export class UploadInformationComponent implements OnInit {
  projectCode: string;
  surveyEventId: number;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.projectCode = this.activatedRoute.snapshot.parent.parent.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.parent.parent.params.surveyEventId;
  }

}

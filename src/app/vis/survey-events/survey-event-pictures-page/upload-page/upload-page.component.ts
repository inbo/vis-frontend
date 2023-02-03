import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'vis-upload-page',
  templateUrl: './upload-page.component.html'
})
export class UploadPageComponent implements OnInit {
  projectCode: string;
  surveyEventId: number;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.projectCode = this.activatedRoute.snapshot.parent.parent.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.parent.parent.params.surveyEventId;
  }

}

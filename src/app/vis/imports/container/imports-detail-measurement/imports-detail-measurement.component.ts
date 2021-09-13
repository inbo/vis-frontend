import {Component, Input, OnInit} from '@angular/core';
import {ImportMeasurement} from '../../../../domain/imports/imports';

@Component({
  selector: 'app-imports-detail-measurement',
  templateUrl: './imports-detail-measurement.component.html'
})
export class ImportsDetailMeasurementComponent implements OnInit {

  @Input() measurement: ImportMeasurement;
  @Input() i: number;

  constructor() { }

  ngOnInit(): void {
  }

}

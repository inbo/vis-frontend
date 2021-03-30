import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationCreateStep4Component } from './location-create-step4.component';

describe('LocationCreateStep4Component', () => {
  let component: LocationCreateStep4Component;
  let fixture: ComponentFixture<LocationCreateStep4Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCreateStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCreateStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

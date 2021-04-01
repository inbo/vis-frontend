import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationCreateStep3Component } from './location-create-step3.component';

describe('LocationCreateStep3Component', () => {
  let component: LocationCreateStep3Component;
  let fixture: ComponentFixture<LocationCreateStep3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCreateStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCreateStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

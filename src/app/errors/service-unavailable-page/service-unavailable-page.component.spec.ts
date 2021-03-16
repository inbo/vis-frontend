import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUnavailablePageComponent } from './service-unavailable-page.component';

describe('ServiceUnavailablePageComponent', () => {
  let component: ServiceUnavailablePageComponent;
  let fixture: ComponentFixture<ServiceUnavailablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceUnavailablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceUnavailablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

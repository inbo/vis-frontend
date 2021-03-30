import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalServerErrorPageComponent } from './internal-server-error-page.component';

describe('InternalServerErrorPageComponent', () => {
  let component: InternalServerErrorPageComponent;
  let fixture: ComponentFixture<InternalServerErrorPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalServerErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalServerErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

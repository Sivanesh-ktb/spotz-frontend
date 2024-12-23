import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourslyRentalComponent } from './hoursly-rental.component';

describe('HourslyRentalComponent', () => {
  let component: HourslyRentalComponent;
  let fixture: ComponentFixture<HourslyRentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HourslyRentalComponent]
    });
    fixture = TestBed.createComponent(HourslyRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

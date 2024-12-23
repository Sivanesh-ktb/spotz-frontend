import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostTermsComponent } from './host-terms.component';

describe('HostTermsComponent', () => {
  let component: HostTermsComponent;
  let fixture: ComponentFixture<HostTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostTermsComponent]
    });
    fixture = TestBed.createComponent(HostTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

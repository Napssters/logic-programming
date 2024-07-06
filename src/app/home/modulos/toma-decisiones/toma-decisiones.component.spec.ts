import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaDecisionesComponent } from './toma-decisiones.component';

describe('TomaDecisionesComponent', () => {
  let component: TomaDecisionesComponent;
  let fixture: ComponentFixture<TomaDecisionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TomaDecisionesComponent]
    });
    fixture = TestBed.createComponent(TomaDecisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoVariablesComponent } from './concepto-variables.component';

describe('ConceptoVariablesComponent', () => {
  let component: ConceptoVariablesComponent;
  let fixture: ComponentFixture<ConceptoVariablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptoVariablesComponent]
    });
    fixture = TestBed.createComponent(ConceptoVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensamientoLogicoComponent } from './pensamiento-logico.component';

describe('PensamientoLogicoComponent', () => {
  let component: PensamientoLogicoComponent;
  let fixture: ComponentFixture<PensamientoLogicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PensamientoLogicoComponent]
    });
    fixture = TestBed.createComponent(PensamientoLogicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularidadComponent } from './modularidad.component';

describe('ModularidadComponent', () => {
  let component: ModularidadComponent;
  let fixture: ComponentFixture<ModularidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModularidadComponent]
    });
    fixture = TestBed.createComponent(ModularidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

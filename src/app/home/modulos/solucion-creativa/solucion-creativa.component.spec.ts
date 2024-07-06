import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolucionCreativaComponent } from './solucion-creativa.component';

describe('SolucionCreativaComponent', () => {
  let component: SolucionCreativaComponent;
  let fixture: ComponentFixture<SolucionCreativaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolucionCreativaComponent]
    });
    fixture = TestBed.createComponent(SolucionCreativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

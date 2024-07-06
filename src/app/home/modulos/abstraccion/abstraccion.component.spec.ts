import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstraccionComponent } from './abstraccion.component';

describe('AbstraccionComponent', () => {
  let component: AbstraccionComponent;
  let fixture: ComponentFixture<AbstraccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbstraccionComponent]
    });
    fixture = TestBed.createComponent(AbstraccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

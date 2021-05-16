import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GimnasioLoginComponent } from './gimnasio-login.component';

describe('GimnasioLoginComponent', () => {
  let component: GimnasioLoginComponent;
  let fixture: ComponentFixture<GimnasioLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GimnasioLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GimnasioLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

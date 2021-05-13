import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GimnasioHomeComponent } from './gimnasio-home.component';

describe('GimnasioHomeComponent', () => {
  let component: GimnasioHomeComponent;
  let fixture: ComponentFixture<GimnasioHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GimnasioHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GimnasioHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCrudComponent } from './formato-crud.component';

describe('FormatoCrudComponent', () => {
  let component: FormatoCrudComponent;
  let fixture: ComponentFixture<FormatoCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

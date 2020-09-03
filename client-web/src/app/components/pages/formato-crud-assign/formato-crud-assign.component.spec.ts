import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCrudAssignComponent } from './formato-crud-assign.component';

describe('FormatoCrudAssignComponent', () => {
  let component: FormatoCrudAssignComponent;
  let fixture: ComponentFixture<FormatoCrudAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoCrudAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCrudAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

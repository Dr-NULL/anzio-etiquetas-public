import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelRectComponent } from './label-rect.component';

describe('LabelRectComponent', () => {
  let component: LabelRectComponent;
  let fixture: ComponentFixture<LabelRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

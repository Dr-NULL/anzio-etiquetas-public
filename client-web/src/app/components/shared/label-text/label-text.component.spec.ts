import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelTextComponent } from './label-text.component';

describe('LabelTextComponent', () => {
  let component: LabelTextComponent;
  let fixture: ComponentFixture<LabelTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

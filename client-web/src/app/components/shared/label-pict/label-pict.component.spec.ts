import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPictComponent } from './label-pict.component';

describe('LabelPictComponent', () => {
  let component: LabelPictComponent;
  let fixture: ComponentFixture<LabelPictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelPictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelPictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

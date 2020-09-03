import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoPictComponent } from './formato-pict.component';

describe('FormatoPictComponent', () => {
  let component: FormatoPictComponent;
  let fixture: ComponentFixture<FormatoPictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoPictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoPictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

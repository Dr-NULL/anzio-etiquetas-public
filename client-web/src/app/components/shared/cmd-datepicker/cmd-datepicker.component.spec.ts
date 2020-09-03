import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdDatepickerComponent } from './cmd-datepicker.component';

describe('CmdDatepickerComponent', () => {
  let component: CmdDatepickerComponent;
  let fixture: ComponentFixture<CmdDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

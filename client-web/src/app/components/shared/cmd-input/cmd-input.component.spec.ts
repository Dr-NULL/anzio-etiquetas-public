import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdInputComponent } from './cmd-input.component';

describe('CmdInputComponent', () => {
  let component: CmdInputComponent;
  let fixture: ComponentFixture<CmdInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

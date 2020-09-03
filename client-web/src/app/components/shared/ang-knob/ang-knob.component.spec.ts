import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngKnobComponent } from './ang-knob.component';

describe('AngKnobComponent', () => {
  let component: AngKnobComponent;
  let fixture: ComponentFixture<AngKnobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngKnobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngKnobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

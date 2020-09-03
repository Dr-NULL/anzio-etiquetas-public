import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCtrlComponent } from './tab-ctrl.component';

describe('TabCtrlComponent', () => {
  let component: TabCtrlComponent;
  let fixture: ComponentFixture<TabCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

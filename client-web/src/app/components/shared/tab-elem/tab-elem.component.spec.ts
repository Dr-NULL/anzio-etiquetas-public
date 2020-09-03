import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabElemComponent } from './tab-elem.component';

describe('TabElemComponent', () => {
  let component: TabElemComponent;
  let fixture: ComponentFixture<TabElemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabElemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

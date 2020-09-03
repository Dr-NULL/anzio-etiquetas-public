import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoTestComponent } from './formato-test.component';

describe('FormatoTestComponent', () => {
  let component: FormatoTestComponent;
  let fixture: ComponentFixture<FormatoTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

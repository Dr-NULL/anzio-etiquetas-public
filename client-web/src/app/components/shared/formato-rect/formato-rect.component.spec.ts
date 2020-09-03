import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoRectComponent } from './formato-rect.component';

describe('FormatoRectComponent', () => {
  let component: FormatoRectComponent;
  let fixture: ComponentFixture<FormatoRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

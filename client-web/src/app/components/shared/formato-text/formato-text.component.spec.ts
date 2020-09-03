import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoTextComponent } from './formato-text.component';

describe('FormatoTextComponent', () => {
  let component: FormatoTextComponent;
  let fixture: ComponentFixture<FormatoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

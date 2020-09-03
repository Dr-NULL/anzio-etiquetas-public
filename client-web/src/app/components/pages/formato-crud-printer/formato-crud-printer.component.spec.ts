import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCrudPrinterComponent } from './formato-crud-printer.component';

describe('FormatoCrudPrinterComponent', () => {
  let component: FormatoCrudPrinterComponent;
  let fixture: ComponentFixture<FormatoCrudPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoCrudPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCrudPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

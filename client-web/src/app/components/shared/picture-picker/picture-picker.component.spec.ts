import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicturePickerComponent } from './picture-picker.component';

describe('PicturePickerComponent', () => {
  let component: PicturePickerComponent;
  let fixture: ComponentFixture<PicturePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicturePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicturePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

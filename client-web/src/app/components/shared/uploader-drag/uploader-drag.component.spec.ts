import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderDragComponent } from './uploader-drag.component';

describe('UploaderDragComponent', () => {
  let component: UploaderDragComponent;
  let fixture: ComponentFixture<UploaderDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploaderDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

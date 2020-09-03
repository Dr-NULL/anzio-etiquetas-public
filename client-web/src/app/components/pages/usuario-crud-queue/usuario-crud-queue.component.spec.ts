import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCrudQueueComponent } from './usuario-crud-queue.component';

describe('UsuarioCrudQueueComponent', () => {
  let component: UsuarioCrudQueueComponent;
  let fixture: ComponentFixture<UsuarioCrudQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCrudQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCrudQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

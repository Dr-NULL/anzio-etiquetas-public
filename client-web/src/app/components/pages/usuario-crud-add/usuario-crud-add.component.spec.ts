import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCrudAddComponent } from './usuario-crud-add.component';

describe('UsuarioCrudAddComponent', () => {
  let component: UsuarioCrudAddComponent;
  let fixture: ComponentFixture<UsuarioCrudAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioCrudAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCrudAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

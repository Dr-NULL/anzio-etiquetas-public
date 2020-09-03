import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAddSystemComponent } from './usuario-add-system.component';

describe('UsuarioSystemComponent', () => {
  let component: UsuarioAddSystemComponent;
  let fixture: ComponentFixture<UsuarioAddSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAddSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioAddSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

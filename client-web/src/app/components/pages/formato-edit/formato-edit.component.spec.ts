import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatoEditComponent } from './formato-edit.component';

describe('FormatoEditComponent', () => {
  let component: FormatoEditComponent;
  let fixture: ComponentFixture<FormatoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

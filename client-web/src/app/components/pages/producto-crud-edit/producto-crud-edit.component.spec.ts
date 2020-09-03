import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCrudEditComponent } from './producto-crud-edit.component';

describe('ProductoCrudEditComponent', () => {
  let component: ProductoCrudEditComponent;
  let fixture: ComponentFixture<ProductoCrudEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoCrudEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoCrudEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

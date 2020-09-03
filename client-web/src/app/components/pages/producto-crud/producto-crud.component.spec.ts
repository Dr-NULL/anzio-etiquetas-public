import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCrudComponent } from './producto-crud.component';

describe('ProductoCrudComponent', () => {
  let component: ProductoCrudComponent;
  let fixture: ComponentFixture<ProductoCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

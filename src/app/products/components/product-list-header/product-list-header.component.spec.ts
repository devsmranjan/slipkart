import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListHeaderComponent } from './product-list-header.component';

describe('ProductListHeaderComponent', () => {
  let component: ProductListHeaderComponent;
  let fixture: ComponentFixture<ProductListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductListHeaderComponent]
    });
    fixture = TestBed.createComponent(ProductListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemListComponent } from './cart-item-list.component';

describe('CartItemListComponent', () => {
  let component: CartItemListComponent;
  let fixture: ComponentFixture<CartItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CartItemListComponent]
    });
    fixture = TestBed.createComponent(CartItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

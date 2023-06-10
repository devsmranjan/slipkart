import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartCalculationComponent } from './containers/cart-calculation/cart-calculation.component';
import { CartItemListComponent } from './containers/cart-item-list/cart-item-list.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemListComponent, CartCalculationComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {}

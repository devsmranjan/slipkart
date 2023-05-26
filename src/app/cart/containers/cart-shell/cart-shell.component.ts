import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartCalculationComponent } from '../cart-calculation/cart-calculation.component';
import { CartItemListComponent } from '../cart-item-list/cart-item-list.component';

@Component({
  selector: 'app-cart-shell',
  standalone: true,
  imports: [CommonModule, CartItemListComponent, CartCalculationComponent],
  templateUrl: './cart-shell.component.html',
  styleUrls: ['./cart-shell.component.scss'],
})
export class CartShellComponent {}

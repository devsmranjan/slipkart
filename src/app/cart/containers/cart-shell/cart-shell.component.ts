import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartItemListComponent } from '../cart-item-list/cart-item-list.component';

@Component({
  selector: 'app-cart-shell',
  standalone: true,
  imports: [CommonModule, CartItemListComponent],
  templateUrl: './cart-shell.component.html',
  styleUrls: ['./cart-shell.component.scss'],
})
export class CartShellComponent {}

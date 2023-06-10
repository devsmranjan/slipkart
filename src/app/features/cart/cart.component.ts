import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CartCalculationComponent, CartItemListComponent } from './containers';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemListComponent, CartCalculationComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {}

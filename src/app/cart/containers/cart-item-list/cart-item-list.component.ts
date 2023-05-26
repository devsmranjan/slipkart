import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '../../../shared/store/cart.store';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart-item-list',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemListComponent {
  // injects
  #cartStore = inject(CartStore);

  // props
  readonly cartVm$ = this.#cartStore.vm$;
}

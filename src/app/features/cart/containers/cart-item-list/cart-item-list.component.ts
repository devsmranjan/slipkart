import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartInterface } from '../../../../shared/models';
import { CartStore } from '../../../../shared/stores';
import { CartItemComponent } from '../../components';

@Component({
  selector: 'app-cart-item-list',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemListComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #cartStore = inject(CartStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly cartVm$ = this.#cartStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  onIncreaseQuantity(item: CartInterface): void {
    this.#cartStore.updateProductQuantity({
      id: item.id,
      quantity: item.quantity + 1,
    });
  }

  onDecreaseQuantity(item: CartInterface): void {
    this.#cartStore.updateProductQuantity({
      id: item.id,
      quantity: item.quantity - 1,
    });
  }

  trackById(index: number, item: CartInterface) {
    return item.id;
  }
}

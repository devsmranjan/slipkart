import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStore } from '../../../../shared/stores';

@Component({
  selector: 'app-cart-calculation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-calculation.component.html',
  styleUrls: ['./cart-calculation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCalculationComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #cartStore = inject(CartStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly cartVm$ = this.#cartStore.vm$;
}

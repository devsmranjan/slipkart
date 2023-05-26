import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '../../../shared/store/cart.store';

@Component({
  selector: 'app-cart-calculation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-calculation.component.html',
  styleUrls: ['./cart-calculation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCalculationComponent {
  // injects
  #cartStore = inject(CartStore);

  // props
  readonly cartVm$ = this.#cartStore.vm$;
}

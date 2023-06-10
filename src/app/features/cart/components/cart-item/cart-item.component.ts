import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CartInterface } from '../../../../shared/models';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Inputs                                   */
  /* -------------------------------------------------------------------------- */

  @Input({ required: true }) item!: CartInterface;

  /* -------------------------------------------------------------------------- */
  /*                                  Outputs                                   */
  /* -------------------------------------------------------------------------- */

  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  onIncreaseQuantity(): void {
    this.increaseQuantity.emit();
  }

  onDecreaseQuantity(): void {
    this.decreaseQuantity.emit();
  }
}

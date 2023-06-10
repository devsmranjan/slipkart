import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProductInterface } from '../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Inputs                                   */
  /* -------------------------------------------------------------------------- */

  @Input({ required: true }) product!: ProductInterface;
  @Input() addedToCart = false;

  /* -------------------------------------------------------------------------- */
  /*                                  Outputs                                   */
  /* -------------------------------------------------------------------------- */

  @Output() clickAddToCart = new EventEmitter<void>();
  @Output() clickRemoveFromCart = new EventEmitter<void>();

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  onClickAddToCart(event: Event): void {
    event.stopPropagation();

    this.clickAddToCart.emit();
  }

  onClickRemoveFromCart(event: Event): void {
    event.stopPropagation();

    this.clickRemoveFromCart.emit();
  }
}

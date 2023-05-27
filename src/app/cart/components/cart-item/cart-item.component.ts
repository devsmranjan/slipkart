import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CartInterface } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartInterface;

  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();

  onIncreaseQuantity(): void {
    this.increaseQuantity.emit();
  }

  onDecreaseQuantity(): void {
    this.decreaseQuantity.emit();
  }
}
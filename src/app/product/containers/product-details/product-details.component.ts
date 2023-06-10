import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

import { CartStore } from '../../../shared/store/cart.store';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';
import { ProductDetailsStore } from './product-details.store';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductDetailsStore, ProductService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #productDetailsStore = inject(ProductDetailsStore);
  #cartStore = inject(CartStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Inputs                                    */
  /* -------------------------------------------------------------------------- */
  @Input() set id(id: string) {
    this.loadProduct(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  productDetailsVm$ = this.#productDetailsStore.vm$;
  cartVm$ = this.#cartStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  loadProduct(id: string) {
    this.#productDetailsStore.loadProduct(id);
  }

  onClickAddToCart(product: ProductInterface) {
    this.#cartStore.addProduct(product);
  }

  onClickRemoveFromCart(product: ProductInterface) {
    this.#cartStore.removeProduct(product.id);
  }
}

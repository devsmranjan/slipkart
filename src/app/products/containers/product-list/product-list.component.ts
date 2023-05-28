import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { CartStore } from '../../../shared/store/cart.store';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductListHeaderComponent } from '../../components/product-list-header/product-list-header.component';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';
import { ProductListStore } from './product-list.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    HttpClientModule,
    ProductListHeaderComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListStore, ProductService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  // injects
  #productListStore = inject(ProductListStore);
  #cartStore = inject(CartStore);
  #router = inject(Router);

  // view models
  readonly productListVm$ = this.#productListStore.vm$;
  readonly cartVm$ = this.#cartStore.vm$;

  ngOnInit(): void {
    this.#productListStore.updatePageStart(1);
    this.#productListStore.loadProducts();
  }

  trackById(index: number, product: ProductInterface) {
    return product.id;
  }

  onClick(product: ProductInterface) {
    this.#router.navigate(['products', product.id]);
  }

  onClickAddToCart(product: ProductInterface) {
    this.#cartStore.addProductToCart(product);
  }

  onClickRemoveFromCart(product: ProductInterface) {
    this.#cartStore.removeProductFromCart(product.id);
  }

  // refresh
  onClickRefresh() {
    this.#productListStore.reloadProducts();
  }

  // search
  onChangeSearchQuery(query: string) {
    this.#productListStore.updateSearchQuery(query);
  }
}

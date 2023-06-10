import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { CartStore } from '../../../../shared/stores';
import {
  ProductCardComponent,
  ProductListHeaderComponent,
} from '../../components';
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
    PaginationComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListStore, ProductService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #productListStore = inject(ProductListStore);
  #cartStore = inject(CartStore);
  #router = inject(Router);

  /* -------------------------------------------------------------------------- */
  /*                                  Inputs                                    */
  /* -------------------------------------------------------------------------- */

  @Input() set page(page: string) {
    this.#productListStore.updateInitialPage(+page);
  }

  @Input() set limit(limit: string) {
    this.#productListStore.updateInitialLimit(+limit);
  }

  @Input() set query(query: string) {
    this.#productListStore.setQuery(query);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly productListVm$ = this.#productListStore.vm$;
  readonly cartVm$ = this.#cartStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  ngOnInit(): void {
    this.#productListStore.loadProducts();
  }

  trackById(index: number, product: ProductInterface) {
    return product.id;
  }

  onClick(product: ProductInterface) {
    this.#router.navigate(['products', product.id]);
  }

  onClickAddToCart(product: ProductInterface) {
    this.#cartStore.addProduct(product);
  }

  onClickRemoveFromCart(product: ProductInterface) {
    this.#cartStore.removeProduct(product.id);
  }

  // refresh
  onClickRefresh() {
    this.#productListStore.reloadProducts();
  }

  // search
  onChangeSearchQuery(query: string) {
    this.#productListStore.searchProducts(query);
  }

  // pagination
  onChangePage(page: number) {
    this.#productListStore.updateCurrentPage(page);
  }

  onChangeLimit(limit: number) {
    this.#productListStore.updateProductListSize(limit);
  }
}

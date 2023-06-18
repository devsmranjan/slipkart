import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginatorComponent } from '../../../../shared/paginator/paginator.component';
import { PageEvent } from '../../../../shared/paginator/paginator.store';
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
    PaginatorComponent,
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
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly productListVm$ = this.#productListStore.vm$;
  readonly cartVm$ = this.#cartStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  constructor() {
    this.updateInitialValues();
  }

  ngOnInit(): void {
    this.#productListStore.fetchProducts(this.#productListStore.params$);
  }

  updateInitialValues() {
    let { page, size, query } = this.#route.snapshot.queryParams;

    this.#productListStore.setInitialPage(+page);
    this.#productListStore.setInitialSize(+size);
    this.#productListStore.setQuery(query);
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
    this.#productListStore.setSearchQuery(query);
  }

  // pagination
  onChangePagination(event: PageEvent) {
    console.log('ProductListComponent → onChangePagination → event:', event);

    this.#productListStore.setPagination({
      page: event.pageIndex,
      size: event.pageSize,
    });
  }
}

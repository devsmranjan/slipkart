import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginationComponent } from '../../../shared/pagination/pagination.component';
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
    PaginationComponent,
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
  #route = inject(ActivatedRoute);

  // inputs
  @Input() set page(page: string) {
    this.#productListStore.updateInitialPage(+page);
  }

  @Input() set limit(limit: string) {
    this.#productListStore.updateInitialLimit(+limit);
  }

  @Input() set query(query: string) {
    this.#productListStore.updateSearchQuery(query);
  }

  // view models
  readonly productListVm$ = this.#productListStore.vm$;
  readonly cartVm$ = this.#cartStore.vm$;

  ngOnInit(): void {
    this.#productListStore.loadProducts();

    this.#route.queryParams.subscribe((params) => {
      console.log(params);
    });
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

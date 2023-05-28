import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounce } from 'lodash-es';
import { Observable, Subject, combineLatest, switchMap, tap } from 'rxjs';

import { ToastStore } from '../../../shared/store/toast.store';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';

interface ProductListParams {
  page: number;
  limit: number;
  query: string | null;
}

interface ProductListState extends ProductListParams {
  products: ProductInterface[] | null;
  total: number;
  loading: boolean | null;
  error: string | null;
}

const initialProductListState: ProductListState = {
  products: null,
  total: 0,
  page: 0,
  limit: 10,
  query: null,
  loading: null,
  error: null,
};

export class ProductListStore extends ComponentStore<ProductListState> {
  constructor() {
    super(initialProductListState);
  }

  /* -------------------------------- Subjects -------------------------------- */

  #refreshProductList$ = new Subject<void>();

  /* --------------------------------- Injects -------------------------------- */

  #productService = inject(ProductService);
  #toastStore = inject(ToastStore);

  /* --------------------------------- Selectors -------------------------------- */

  readonly #products$ = this.select((state) => state.products); // products
  readonly #total$ = this.select((state) => state.total); // total products
  readonly #page$ = this.select((state) => state.page); // current page
  readonly #limit$ = this.select((state) => state.limit); // limit per page
  readonly #query$ = this.select((state) => state.query); // search query
  readonly #loading$ = this.select((state) => state.loading); // loading state
  readonly #error$ = this.select((state) => state.error); // error message

  /* --------------------------- Combined Selectors --------------------------- */

  // view models
  readonly vm$ = this.select(
    this.#products$,
    this.#total$,
    this.#page$,
    this.#limit$,
    this.#loading$,
    this.#error$,

    (products, total, page, limit, loading, error) => ({
      products,
      total,
      page,
      limit,
      loading,
      error,
    })
  );

  // dependencies for fetching products
  readonly #dependencies$ = this.select(
    this.#page$,
    this.#limit$,
    this.#query$,

    (page, limit, query) => ({ page, limit, query })
  );

  /* --------------------------------- Updaters -------------------------------- */

  readonly #setProducts = this.updater(
    (state: ProductListState, products: ProductInterface[] | null) => ({
      ...state,
      products,
    })
  );

  readonly #setLoading = this.updater(
    (state: ProductListState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  readonly #setError = this.updater(
    (state: ProductListState, error: string | null) => ({
      ...state,
      error,
    })
  );

  readonly #setTotal = this.updater(
    (state: ProductListState, total: number) => ({
      ...state,
      total,
    })
  );

  readonly #setCurrentPage = this.updater(
    (state: ProductListState, page: number) => ({
      ...state,
      page,
    })
  );

  readonly #setListSize = this.updater(
    (state: ProductListState, limit: number) => ({
      ...state,
      limit,
    })
  );

  readonly #setSearchQuery = this.updater(
    (state: ProductListState, query: string | null) => ({
      ...state,
      query,
    })
  );

  /* --------------------------------- Effects -------------------------------- */

  readonly #fetchProducts = this.effect(
    (params$: Observable<ProductListParams>) =>
      combineLatest([params$, this.#refreshProductList$]).pipe(
        tap(() => {
          this.#setLoading(true);
        }),
        switchMap(([{ limit, page, query }]) => {
          return this.#productService.getProducts(limit, page, query).pipe(
            tapResponse(
              (response) => {
                this.#setTotal(response.total);
                this.#setProducts(response.products);
                this.#setError(null);
              },
              (error: HttpErrorResponse) => {
                this.#setError(error.error?.message ?? error.message);
              },
              () => {
                this.#setLoading(false);
                this.#toastStore.hideToast();
              }
            )
          );
        })
      )
  );

  /* --------------------------------- Methods -------------------------------- */

  // load products if not loaded yet
  loadProducts() {
    // create subscription for the initial state
    if (this.get().loading === null) {
      this.#fetchProducts(this.#dependencies$);
    }

    this.#refreshProductList$.next();
  }

  // reload products
  #reloadProducts() {
    this.#toastStore.showToast({
      message: 'Refreshing...',
      type: 'info',
    });

    this.#refreshProductList$.next();
  }

  reloadProducts = debounce(this.#reloadProducts, 1000, {
    leading: true,
    trailing: true,
  });

  // search products
  setSearchQuery = debounce(this.#setSearchQuery, 1000, {
    leading: false,
    trailing: true,
  });

  // set page
  setCurrentPage = debounce(this.#setCurrentPage, 1000, {
    leading: false,
    trailing: true,
  });

  // set list size
  setListSize = debounce(this.#setListSize, 1000, {
    leading: false,
    trailing: true,
  });
}

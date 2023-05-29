import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounce } from 'lodash-es';
import { Observable, switchMap, tap } from 'rxjs';

import { ToastInterface } from '../../../shared/models/toast.model';
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
  pageStart: number;
  limitStart: number;
  loading: boolean | null;
  error: string | null;
}

const initialProductListState: ProductListState = {
  products: null,
  total: 0,
  pageStart: 0,
  page: 0,
  limitStart: 10,
  limit: 10,
  query: null,
  loading: null,
  error: null,
};

export class ProductListStore extends ComponentStore<ProductListState> {
  constructor() {
    super(initialProductListState);
  }

  /* --------------------------------- Injects -------------------------------- */

  #productService = inject(ProductService);
  #toastStore = inject(ToastStore);

  /* --------------------------------- Selectors -------------------------------- */

  readonly #products$ = this.select((state) => state.products); // products
  readonly #total$ = this.select((state) => state.total); // total products
  readonly #pageStart$ = this.select((state) => state.pageStart); // page start
  readonly #page$ = this.select((state) => state.page); // current page
  readonly #limitStart$ = this.select((state) => state.limitStart); // limit start
  readonly #limit$ = this.select((state) => state.limit); // limit per page
  readonly #query$ = this.select((state) => state.query); // search query
  readonly #loading$ = this.select((state) => state.loading); // loading state
  readonly #error$ = this.select((state) => state.error); // error message

  /* --------------------------- Combined Selectors --------------------------- */

  // view models
  readonly vm$ = this.select(
    this.#products$,
    this.#total$,
    this.#pageStart$,
    this.#page$,
    this.#limitStart$,
    this.#limit$,
    this.#query$,
    this.#loading$,
    this.#error$,

    (
      products,
      total,
      pageStart,
      page,
      limitStart,
      limit,
      query,
      loading,
      error
    ) => ({
      products,
      total,
      pageStart,
      page,
      limitStart,
      limit,
      query,
      loading,
      error,
    })
  );

  /* --------------------------------- Updaters -------------------------------- */

  readonly setProducts = this.updater(
    (state: ProductListState, products: ProductInterface[] | null) => ({
      ...state,
      products,
    })
  );

  readonly setLoading = this.updater(
    (state: ProductListState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  readonly setError = this.updater(
    (state: ProductListState, error: string | null) => ({
      ...state,
      error,
    })
  );

  readonly setTotal = this.updater(
    (state: ProductListState, total: number) => ({
      ...state,
      total,
    })
  );

  readonly setPageStart = this.updater(
    (state: ProductListState, pageStart: number) => ({
      ...state,
      pageStart,
    })
  );

  readonly setPage = this.updater((state: ProductListState, page: number) => ({
    ...state,
    page,
  }));

  readonly setLimitStart = this.updater(
    (state: ProductListState, limitStart: number) => ({
      ...state,
      limitStart,
    })
  );

  readonly setLimit = this.updater(
    (state: ProductListState, limit: number) => ({
      ...state,
      limit,
    })
  );

  readonly setQuery = this.updater(
    (state: ProductListState, query: string | null) => ({
      ...state,
      query,
    })
  );

  /* --------------------------------- Effects -------------------------------- */

  readonly #fetchProducts = this.effect(
    (params$: Observable<ProductListParams>) =>
      params$.pipe(
        tap(() => {
          this.setLoading(true);
        }),
        switchMap(({ limit, page, query }) => {
          return this.#productService.getProducts(limit, page, query).pipe(
            tapResponse(
              (response) => {
                this.setTotal(response.total);
                this.setProducts(response.products);
                this.setError(null);
              },
              (error: HttpErrorResponse) => {
                this.setError(error.error?.message ?? error.message);
              },
              () => {
                this.setLoading(false);
                this.#toastStore.hideToast();
              }
            )
          );
        })
      )
  );

  /* --------------------------------- Methods -------------------------------- */

  // load products if not loaded yet
  loadProducts(toast: ToastInterface | null = null) {
    if (toast) {
      this.#toastStore.showToast(toast);
    }

    // create subscription for the initial state
    const { page, limit, query } = this.get();

    this.#fetchProducts({ page, limit, query });
  }

  // reload products
  reloadProducts = debounce(
    () => {
      this.loadProducts({
        message: 'Refreshing...',
        type: 'info',
      });
    },
    1000,
    {
      leading: true,
      trailing: true,
    }
  );

  updateInitialPage(page: number) {
    this.setPageStart(page);
    this.setPage(page);
  }

  updateInitialLimit(limit: number) {
    this.setLimitStart(limit);
    this.setLimit(limit);
  }

  // search products
  searchProducts = debounce(
    (query: string) => {
      this.setQuery(query);
      this.updateInitialPage(initialProductListState.page);
      this.loadProducts({
        message: 'Searching...',
        type: 'info',
      });
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  // set page
  updateCurrentPage = debounce((page: number) => {
    this.setPage(page);
    this.loadProducts({
      message: 'Updating...',
      type: 'info',
    });
  }, 1000);

  // set list size
  updateProductListSize = debounce((limit: number) => {
    this.setLimit(limit);
    this.setPage(initialProductListState.page);
    this.loadProducts({
      message: 'Updating...',
      type: 'info',
    });
  }, 1000);
}

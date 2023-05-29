import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounce } from 'lodash-es';
import { Observable, switchMap, tap } from 'rxjs';

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

  readonly #setPageStart = this.updater(
    (state: ProductListState, pageStart: number) => ({
      ...state,
      pageStart,
    })
  );

  readonly #setCurrentPage = this.updater(
    (state: ProductListState, page: number) => ({
      ...state,
      page,
    })
  );

  readonly #setLimitStart = this.updater(
    (state: ProductListState, limitStart: number) => ({
      ...state,
      limitStart,
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
      params$.pipe(
        tap(() => {
          this.#setLoading(true);
        }),
        switchMap(({ limit, page, query }) => {
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
    const { page, limit, query } = this.get();

    this.#fetchProducts({ page, limit, query });
  }

  // reload products
  #reloadProducts() {
    this.#toastStore.showToast({
      message: 'Refreshing...',
      type: 'info',
    });

    this.loadProducts();
  }

  reloadProducts = debounce(
    () => {
      this.#reloadProducts();
    },
    1000,
    {
      leading: true,
      trailing: true,
    }
  );

  updatePageStart(page: number) {
    this.#setPageStart(page);
    this.#setCurrentPage(page);
  }

  updateLimitStart(limitStart: number) {
    this.#setLimitStart(limitStart);
    this.#setListSize(limitStart);
  }

  // search products
  updateSearchQuery = debounce(
    (query: string) => {
      this.#setSearchQuery(query);
      this.updatePageStart(initialProductListState.page);
      this.#reloadProducts();
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  // set page
  updateCurrentPage = debounce(
    (page: number) => {
      this.#setCurrentPage(page);
      this.#reloadProducts();
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  // set list size
  updateListSize = debounce(
    (limit: number) => {
      this.#setListSize(limit);
      this.#setCurrentPage(initialProductListState.page);
      this.#reloadProducts();
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );
}

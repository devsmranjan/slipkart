import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounce } from 'lodash-es';
import { Observable, switchMap, tap } from 'rxjs';

import { ToastInterface } from '../../../../shared/models';
import { ToastStore } from '../../../../shared/stores';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';

interface ProductListParams {
  page: number;
  size: number;
  query: string | null;
}

interface ProductListState extends ProductListParams {
  products: ProductInterface[] | null;
  total: number;
  pageStart: number;
  sizeStart: number;
  loading: boolean | null;
  error: string | null;
}

const initialProductListState: ProductListState = {
  products: null,
  total: 0,
  pageStart: 0,
  page: 0,
  sizeStart: 10,
  size: 10,
  query: null,
  loading: null,
  error: null,
};

export class ProductListStore extends ComponentStore<ProductListState> {
  constructor() {
    super(initialProductListState);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #productService = inject(ProductService);
  #toastStore = inject(ToastStore);
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly #products$ = this.select((state) => state.products); // products
  readonly #total$ = this.select((state) => state.total); // total products
  readonly #pageStart$ = this.select((state) => state.pageStart); // page start
  readonly #page$ = this.select((state) => state.page); // current page
  readonly #sizeStart$ = this.select((state) => state.sizeStart); // size start
  readonly #size$ = this.select((state) => state.size); // size per page
  readonly #query$ = this.select((state) => state.query).pipe(
    tap(() => this.updateRouteParams())
  ); // search query
  readonly #loading$ = this.select((state) => state.loading); // loading state
  readonly #error$ = this.select((state) => state.error); // error message

  // view models
  readonly vm$ = this.select(
    this.#products$,
    this.#total$,
    this.#pageStart$,
    this.#page$,
    this.#sizeStart$,
    this.#size$,
    this.#query$,
    this.#loading$,
    this.#error$,

    (
      products,
      total,
      pageStart,
      page,
      sizeStart,
      size,
      query,
      loading,
      error
    ) => ({
      products,
      total,
      pageStart,
      page,
      sizeStart,
      size,
      query,
      loading,
      error,
    })
  );

  /* -------------------------------------------------------------------------- */
  /*                                  Updaters                                  */
  /* -------------------------------------------------------------------------- */

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

  readonly setSizeStart = this.updater(
    (state: ProductListState, sizeStart: number) => ({
      ...state,
      sizeStart,
    })
  );

  readonly setSize = this.updater((state: ProductListState, size: number) => ({
    ...state,
    size,
  }));

  readonly setQuery = this.updater(
    (state: ProductListState, query: string | null) => ({
      ...state,
      query: query || null,
    })
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  readonly #fetchProducts = this.effect(
    (params$: Observable<ProductListParams>) =>
      params$.pipe(
        tap(() => {
          this.setLoading(true);
        }),
        switchMap(({ size, page, query }) => {
          return this.#productService.getProducts(size, page, query).pipe(
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

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */

  // load products if not loaded yet
  loadProducts(toast: ToastInterface | null = null) {
    if (toast) {
      this.#toastStore.showToast(toast);
    }

    // create subscription for the initial state
    const { page, size, query } = this.get();

    this.#fetchProducts({ page, size, query });
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
    if (Number.isNaN(page)) {
      page = initialProductListState.page;
    }

    this.setPageStart(page);
    this.setPage(page);
  }

  updateInitialSize(size: number) {
    if (Number.isNaN(size)) {
      size = initialProductListState.size;
    }

    this.setSizeStart(size);
    this.setSize(size);
  }

  // search products
  searchProducts = debounce((query: string) => {
    this.setQuery(query);
    this.updateInitialPage(initialProductListState.page);
    this.setTotal(initialProductListState.total);

    this.updateRouteParams();

    this.loadProducts({
      message: 'Searching...',
      type: 'info',
    });
  }, 1000);

  // set page
  updatePagination = debounce((page: number, size: number) => {
    this.setPage(page);
    this.setSize(size);
    this.updateRouteParams();

    this.loadProducts({
      message: 'Updating...',
      type: 'info',
    });
  }, 1000);

  updateRouteParams() {
    const { page, size, query } = this.get();

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { page, size, query },
      queryParamsHandling: 'merge',
    });
  }
}

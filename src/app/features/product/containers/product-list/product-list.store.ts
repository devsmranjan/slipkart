import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Observable,
  debounce,
  exhaustMap,
  map,
  switchMap,
  tap,
  timer,
} from 'rxjs';

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
  readonly #query$ = this.select((state) => state.query); // search query
  readonly #loading$ = this.select((state) => state.loading); // loading state
  readonly #error$ = this.select((state) => state.error); // error message

  // params
  readonly params$ = this.select(
    this.#page$,
    this.#size$,
    this.#query$,
    (page, size, query) => ({ page, size, query }),
    { debounce: true }
  ).pipe(
    tap(({ page, size, query }) => {
      this.#router.navigate([], {
        relativeTo: this.#route,
        queryParams: { page, size, query },
        queryParamsHandling: 'merge',
      });
    })
  );

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

  readonly setQuery = this.updater(
    (state: ProductListState, query: string | null) => ({
      ...state,
      query: query || null,
    })
  );

  readonly setPagination = this.updater(
    (
      state: ProductListState,
      { page, size }: Omit<ProductListParams, 'query'>
    ) => ({
      ...state,
      page,
      size,
    })
  );

  readonly setSearchQuery = this.updater(
    (state: ProductListState, query: string | null) => ({
      ...state,
      query: query || null,
      pageStart: initialProductListState.page,
      page: initialProductListState.page,
      total: initialProductListState.total,
      sizeStart: state.size,
    })
  );

  readonly setInitialPage = this.updater(
    (state: ProductListState, page: number) => {
      if (Number.isNaN(page)) {
        page = initialProductListState.page;
      }

      return {
        ...state,
        pageStart: page,
        page,
      };
    }
  );

  readonly setInitialSize = this.updater(
    (state: ProductListState, size: number) => {
      if (Number.isNaN(size)) {
        size = initialProductListState.size;
      }

      return {
        ...state,
        sizeStart: size,
        size,
      };
    }
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  readonly #getProducts = ({ size, page, query }: ProductListParams) => {
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
  };

  readonly fetchProducts = this.effect(
    (params$: Observable<ProductListParams>) =>
      params$.pipe(
        // no debounce initially
        debounce(() => (this.get().loading === null ? timer(0) : timer(500))),
        tap(() => {
          if (this.get().loading !== null) {
            this.#toastStore.showToast({
              message: 'Updating products...',
              type: 'info',
            });
          }

          this.setLoading(true);
        }),
        switchMap(({ size, page, query }) => {
          return this.#getProducts({ size, page, query });
        })
      )
  );

  // reload products with exhaust map
  readonly reloadProducts = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => {
        this.#toastStore.showToast({
          message: 'Refreshing products...',
          type: 'info',
        });

        this.setLoading(true);
      }),
      map(() => {
        return this.get();
      }),
      exhaustMap(({ page, size, query }) => {
        return this.#getProducts({ size, page, query });
      })
    )
  );
}

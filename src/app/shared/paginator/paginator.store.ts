import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  pairwise,
  skip,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

interface PaginatorState {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageSizeOptions: ReadonlySet<number>;
}

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export interface PageEvent
  extends Pick<PaginatorState, 'pageIndex' | 'pageSize' | 'total'> {
  /**
   * Index of the page that was selected previously.
   */
  previousPageIndex?: number;
}

const initialState: PaginatorState = {
  pageIndex: 0,
  pageSize: 10,
  total: 0,
  pageSizeOptions: new Set([5, 10, 25, 100]),
};

@Injectable()
export class PaginatorStore extends ComponentStore<PaginatorState> {
  constructor() {
    super(initialState);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly #hasPreviousPage$ = this.select(
    ({ pageIndex, pageSize }) => pageIndex >= 1 && pageSize != 0
  );

  readonly #numberOfPages$ = this.select(({ pageSize, total }) => {
    if (!pageSize) return 0;

    return Math.ceil(total / pageSize);
  });

  readonly #hasNextPage$ = this.select(
    this.state$,
    this.#numberOfPages$,
    ({ pageIndex, pageSize }, numberOfPages) => {
      const maxPageIndex = numberOfPages - 1;
      return pageIndex < maxPageIndex && pageSize != 0;
    }
  );

  readonly #rangeLabel$ = this.select(({ pageIndex, pageSize, total }) => {
    if (total === 0 || pageSize === 0) return `0 of ${total}`;

    total = Math.max(total, 0);
    const startIndex = pageIndex * pageSize;

    // If the start index exceeds the list total length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < total
        ? Math.min(startIndex + pageSize, total)
        : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} of ${total}`;
  });

  // ViewModel
  readonly vm$ = this.select(
    this.state$,
    this.#hasPreviousPage$,
    this.#hasNextPage$,
    this.#rangeLabel$,
    (state, hasPreviousPage, hasNextPage, rangeLabel) => ({
      pageSize: state.pageSize,
      pageSizeOptions: Array.from(state.pageSizeOptions),
      pageIndex: state.pageIndex,
      hasPreviousPage,
      hasNextPage,
      rangeLabel,
    })
  );

  readonly #pageIndexChanges$ = this.state$.pipe(
    // map instead of select, so that non-distinct value could go through
    map((state) => state.pageIndex),
    pairwise()
  );

  readonly page$: Observable<PageEvent> = this.select(
    this.#pageIndexChanges$,
    this.select((state) => [state.pageSize, state.total]),
    // Now combining the results from both of these Observables into a PageEvent object
    ([previousPageIndex, pageIndex], [pageSize, total]) => ({
      pageIndex,
      previousPageIndex,
      pageSize,
      total,
    }),
    // debounce, so that we let the state "settle"
    { debounce: true }
  ).pipe(
    // Skip the emission of the initial state values
    skip(1)
  );

  /* -------------------------------------------------------------------------- */
  /*                                  Updaters                                  */
  /* -------------------------------------------------------------------------- */

  readonly setPageIndex = this.updater((state, value: string | number) => ({
    ...state,
    pageIndex: Number(value) || 0,
  }));

  readonly setPageSize = this.updater((state, value: string | number) => ({
    ...state,
    pageSize: Number(value) || 0,
  }));

  readonly setTotal = this.updater((state, value: string | number) => ({
    ...state,
    total: Number(value) || 0,
  }));

  readonly setPageSizeOptions = this.updater(
    (state, value: readonly number[]) => {
      // Making sure that the pageSize is included and sorted
      const pageSizeOptions = new Set<number>(
        [...value, state.pageSize].sort((a, b) => a - b)
      );

      return { ...state, pageSizeOptions };
    }
  );

  readonly changePageSize = this.updater((state, newPageSize: number) => {
    const startIndex = state.pageIndex * state.pageSize;

    return {
      ...state,
      pageSize: newPageSize,
      pageIndex: Math.floor(startIndex / newPageSize),
    };
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  readonly nextPage = this.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.#hasNextPage$),
      filter(([, hasNextPage]) => hasNextPage),
      tap(() => {
        this.setPageIndex(this.get().pageIndex + 1);
      })
    );
  });

  readonly firstPage = this.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.#hasPreviousPage$),
      filter(([, hasPreviousPage]) => hasPreviousPage),
      tap(() => {
        this.setPageIndex(0);
      })
    );
  });

  readonly previousPage = this.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.#hasPreviousPage$),
      filter(([, hasPreviousPage]) => hasPreviousPage),
      tap(() => {
        this.setPageIndex(this.get().pageIndex - 1);
      })
    );
  });

  readonly lastPage = this.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.#hasNextPage$, this.#numberOfPages$),
      filter(([, hasNextPage]) => hasNextPage),
      tap(([, , numberOfPages]) => {
        this.setPageIndex(numberOfPages - 1);
      })
    );
  });
}

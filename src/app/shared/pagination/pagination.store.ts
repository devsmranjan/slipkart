import { ComponentStore } from '@ngrx/component-store';

interface PaginationState {
  page: number;
  size: number;
  total: number;
}

const initialState: PaginationState = {
  page: 0,
  size: 10,
  total: 0,
};

export class PaginationStore extends ComponentStore<PaginationState> {
  constructor() {
    super(initialState);
  }

  readonly #size$ = this.select((state) => state.size);

  readonly #page$ = this.select((state) => state.page);
  readonly #total$ = this.select((state) => state.total);

  readonly #isFirstPage$ = this.select(this.#page$, (page) => page === 0);
  readonly #isLastPage$ = this.select(
    this.#page$,
    this.#size$,
    this.#total$,
    (page) => {
      const pages = this.#totalPages();
      return page === pages - 1;
    }
  );

  readonly #pages$ = this.select(this.#size$, this.#total$, (size, total) => {
    const pages = this.#totalPages();

    const pagesArray = [];

    for (let i = 0; i < pages; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  });

  readonly vm$ = this.select(
    this.#page$,
    this.#size$,
    this.#total$,
    this.#isFirstPage$,
    this.#isLastPage$,
    this.#pages$,
    this.#size$,
    (page, size, total, isFirstPage, isLastPage, pages, sizes) => ({
      page,
      size,
      total,
      isFirstPage,
      isLastPage,
      pages,
      sizes,
    })
  );

  readonly setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  readonly setSize = this.updater((state, size: number) => ({
    ...state,
    size,
  }));

  readonly setTotal = this.updater((state, total: number) => ({
    ...state,
    total,
  }));

  #totalPages() {
    return Math.ceil(this.get().total / this.get().size);
  }

  nextPage() {
    const page =
      this.get().page === this.#totalPages() - 1
        ? this.get().page
        : this.get().page + 1;

    this.setPage(page);

    return page;
  }

  previousPage() {
    const page = this.get().page === 0 ? 0 : this.get().page - 1;

    this.setPage(page);

    return page;
  }
}

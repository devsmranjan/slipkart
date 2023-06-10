import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  inject,
} from '@angular/core';

import { PaginatorStore } from './paginator.store';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  providers: [PaginatorStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  paginatorStore = inject(PaginatorStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Inputs                                    */
  /* -------------------------------------------------------------------------- */

  @Input() set pageIndex(value: string | number) {
    this.paginatorStore.setPageIndex(value);
  }

  @Input() set total(value: string | number) {
    this.paginatorStore.setTotal(value);
  }

  @Input() set pageSize(value: string | number) {
    this.paginatorStore.setPageSize(+value);
  }

  @Input() set pageSizeOptions(value: readonly number[]) {
    this.paginatorStore.setPageSizeOptions(value);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Outputs                                   */
  /* -------------------------------------------------------------------------- */

  // Outputing the event directly from the page$ Observable<PageEvent> property.
  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page = this.paginatorStore.page$;

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly vm$ = this.paginatorStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                  Methods                                   */
  /* -------------------------------------------------------------------------- */

  changePageSize(newPageSize: number) {
    this.paginatorStore.changePageSize(newPageSize);
  }

  nextPage() {
    this.paginatorStore.nextPage();
  }

  firstPage() {
    this.paginatorStore.firstPage();
  }

  previousPage() {
    this.paginatorStore.previousPage();
  }

  lastPage() {
    this.paginatorStore.lastPage();
  }
}

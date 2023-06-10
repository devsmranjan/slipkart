import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { PaginationStore } from './pagination.store';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [PaginationStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #paginationStore = inject(PaginationStore);

  /* -------------------------------------------------------------------------- */
  /*                                   Inputs                                   */
  /* -------------------------------------------------------------------------- */

  @Input() set initialPage(page: number) {
    this.#paginationStore.setPage(page);
  }

  @Input() set initialSize(size: number) {
    this.#paginationStore.setSize(size);
  }

  @Input() set page(page: number) {
    this.#paginationStore.setPage(page);
  }

  @Input() set total(total: number) {
    this.#paginationStore.setTotal(total);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Outputs                                   */
  /* -------------------------------------------------------------------------- */

  @Output() changePage = new EventEmitter<number>();
  @Output() changeSize = new EventEmitter<number>();

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly vm$ = this.#paginationStore.vm$;

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  onClickNext() {
    const page = this.#paginationStore.nextPage();
    this.changePage.emit(page);
  }

  onClickPrevious() {
    const page = this.#paginationStore.previousPage();
    this.changePage.emit(page);
  }

  onClickPage(page: number) {
    this.#paginationStore.setPage(page);
    this.changePage.emit(page);
  }

  onChangeSize(e: Event) {
    const size = +(e.target as HTMLSelectElement).value;
    this.#paginationStore.setSize(size);
    this.changeSize.emit(size);
  }
}

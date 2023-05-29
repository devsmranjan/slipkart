import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { tap } from 'rxjs';
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
  // injects
  #paginationStore = inject(PaginationStore);

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

  @Output() changePage = new EventEmitter<number>();

  readonly vm$ = this.#paginationStore.vm$.pipe(
    tap((vm) => console.log('PaginationComponent.vm$', vm))
  );

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
}

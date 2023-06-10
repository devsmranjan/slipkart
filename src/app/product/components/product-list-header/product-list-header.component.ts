import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-product-list-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-header.component.html',
  styleUrls: ['./product-list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListHeaderComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Inputs                                   */
  /* -------------------------------------------------------------------------- */

  @Input() query: string | null = null;

  /* -------------------------------------------------------------------------- */
  /*                                  Outputs                                   */
  /* -------------------------------------------------------------------------- */

  @Output() clickRefresh = new EventEmitter<void>();
  @Output() changeSearchQuery = new EventEmitter<string>();

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  onClickRefresh() {
    this.clickRefresh.emit();
  }

  onChangeSearchQuery(e: Event) {
    const target = e.target as HTMLInputElement;
    this.changeSearchQuery.emit(target.value);
  }
}

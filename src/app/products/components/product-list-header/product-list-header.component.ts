import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
  @Output() clickRefresh = new EventEmitter<void>();

  onClickRefresh() {
    this.clickRefresh.emit();
  }
}

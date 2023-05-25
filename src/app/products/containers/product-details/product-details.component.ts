import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ProductService } from '../../product.service';
import { ProductDetailsStore } from './product-details.store';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductDetailsStore, ProductService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  // injects
  #productDetailsStore = inject(ProductDetailsStore);

  // setters
  @Input() set id(id: string) {
    this.loadProduct(id);
  }

  vm$ = this.#productDetailsStore.vm$;

  // dispatchers
  loadProduct(id: string) {
    this.#productDetailsStore.loadProduct(id);
  }
}

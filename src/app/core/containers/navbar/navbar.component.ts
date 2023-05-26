import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartStore } from '../../../shared/store/cart.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // injects
  #cartStore = inject(CartStore);
  #router = inject(Router);

  // props
  readonly cartVm$ = this.#cartStore.vm$;

  // methods
  onCartClick(): void {
    this.#router.navigate(['cart']);
  }
}

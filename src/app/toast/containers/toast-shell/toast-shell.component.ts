import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastStore } from '../../../shared/store/toast.store';

@Component({
  selector: 'app-toast-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-shell.component.html',
  styleUrls: ['./toast-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastShellComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #toastStore = inject(ToastStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly toastVm$ = this.#toastStore.vm$;
}

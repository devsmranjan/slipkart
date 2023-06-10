import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastStore } from '../../shared/stores';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #toastStore = inject(ToastStore);

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly toastVm$ = this.#toastStore.vm$;
}

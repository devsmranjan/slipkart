import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './core/containers';
import { ToastComponent } from './features/toast/toast.component';
import { CartStore, ToastStore } from './shared/stores';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CartStore, ToastStore],
})
export class AppComponent {
  title = 'flipkart-v2';
}

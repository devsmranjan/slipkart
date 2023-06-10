import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './core/containers/navbar/navbar.component';
import { CartStore } from './shared/store/cart.store';
import { ToastStore } from './shared/store/toast.store';
import { ToastComponent } from './toast/toast.component';

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

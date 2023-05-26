import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/containers/navbar/navbar.component';
import { CartStore } from './shared/store/cart.store';
import { ToastStore } from './shared/store/toast.store';
import { ToastShellComponent } from './toast/containers/toast-shell/toast-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastShellComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CartStore, ToastStore],
})
export class AppComponent {
  title = 'flipkart-v2';
}

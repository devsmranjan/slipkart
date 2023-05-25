import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent {}

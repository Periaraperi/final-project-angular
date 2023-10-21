import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TopbarComponent } from './core/components/topbar/topbar.component';

import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [TopbarComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'final-project-angular';
}

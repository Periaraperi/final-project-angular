import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IWork } from '../../models/models';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-works-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './works-list.component.html',
  styleUrls: ['./works-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorksListComponent {
  @Input() foundWorks$: Observable<IWork[]> | null = null;
  @Input() waitingForSearch: boolean = false;
}

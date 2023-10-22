import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullInfo, IISBNBook } from '../../models/book-model';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultComponent {
  constructor() {}
  @Input() book$: Observable<IISBNBook> | null = null;
  @Input() books$: Observable<{title: string, description:string}[]> | null = null;

}

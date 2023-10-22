import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FullInfo, IISBNBook } from '../../models/book-model';
import { IAuthor } from '../../models/author-model';
import { ActivatedRoute, Router } from '@angular/router';
import { BookSearchService } from '../../services/book-search.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent {
  book$: Observable<FullInfo> | null = null;
  isbn: string = "";
  constructor(private router: ActivatedRoute, private bookService: BookSearchService) {
    this.isbn = this.router.snapshot.paramMap.get('isbn')!;
    console.log(this.isbn);
    this.book$ = this.bookService.getFullInfo(this.isbn);
  }
}

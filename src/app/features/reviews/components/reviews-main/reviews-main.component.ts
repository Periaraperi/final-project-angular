import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../review/review.component';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { IReview } from '../../models/models';
import { ReviewService } from '../../services/review.service';
import { IBookISBN } from 'src/app/features/books/models/models';
import { BookSearchService } from 'src/app/features/books/services/book-search.service';
import { BookDetailsComponent } from 'src/app/features/books/components/book-details/book-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews-main',
  standalone: true,
  imports: [CommonModule, ReviewComponent, BookDetailsComponent],
  templateUrl: './reviews-main.component.html',
  styleUrls: ['./reviews-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsMainComponent implements OnInit {
  constructor(private reviewService: ReviewService,
              private bookService: BookSearchService,
              private router: Router) {}
  reviews$: Observable<IReview[]> | null = null;
  books$: Observable<IBookISBN[]> | null = null;
  ngOnInit(): void {
    this.reviews$ = this.reviewService.getAllReviews();
    this.books$ = this.reviews$.pipe(
      switchMap((res) => {
        const keys: {key: string}[] = res.map((elem) => {return {key:elem.id};});
        return this.bookService.getBooks(keys);
      })
    );
  }

  onSeeReviews(key: string) {
    this.router.navigate(["/reviews/book",key]);
  }

}

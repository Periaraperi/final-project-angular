import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { BookSearchService } from '../../services/book-search.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { AuthorEndPoint, IEditions } from '../../models/models';
import { UserService } from 'src/app/features/users/services/user.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ReviewService } from 'src/app/features/reviews/services/review.service';

@Component({
  selector: 'app-editions',
  standalone: true,
  imports: [CommonModule, RouterLink, BookDetailsComponent, PaginationComponent],
  templateUrl: './editions.component.html',
  styleUrls: ['./editions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionsComponent implements OnInit {
  editions$: Observable<IEditions> | null = null;
  slicedEditions$: Observable<IEditions> | null = null;

  workId: string = "";
  showDetails: boolean[] = [];
  isLoggedIn$ = this.userService.isLoggedIn$;

  constructor(private route: ActivatedRoute,
              private bookService: BookSearchService,
              private authorService: AuthorService,
              private userService: UserService,
              private reviewService: ReviewService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.workId = this.route.snapshot.paramMap.get('workId')!;
    this.editions$ = this.bookService.getEditions(this.workId);
    this.slicedEditions$ = this.getPaginated(this.editions$);

  }

  getAuthorData(authors: AuthorEndPoint[]) {
    return this.authorService.getAuthors(authors);
  }

  onShowDetails(i: number) {
    this.showDetails[i] = true;
  }

  onHideDetails(i: number) {
    this.showDetails[i] = false;
  }

  onMarkBook(key: string) {
    console.log(key);
    this.userService.addBook(key);
  }

  onViewReviews(key: string) {
    console.log("reviews for", key);
    this.reviewService.exists(key).subscribe(
      (ok) => {
        if (!ok) {
          this.reviewService.addBook(key).subscribe(
            () => {this.router.navigate(["/reviews/book",key]);}
          );
        } else {
          this.router.navigate(["/reviews/book",key]);
        }
      }
    );
  }

  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
    this.slicedEditions$ = this.getPaginated(this.editions$!);
    this.showDetails = [];
  }

  private getPaginated(editions$: Observable<IEditions>): Observable<IEditions> {
    return editions$.pipe(
      map((editions) => {
        this.totalPages = Math.ceil(editions.entries.length / this.limit);
        const startIndex = (this.currentPage-1)*this.limit;
        const endIndex = Math.min(startIndex+this.limit, editions.entries.length);
        return {entries:editions.entries.slice(startIndex,endIndex)};
      })
    );
  }

}

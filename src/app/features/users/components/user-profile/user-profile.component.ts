import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user-model';
import { Observable, map, of, switchMap } from 'rxjs';
import { BookSearchService } from 'src/app/features/books/services/book-search.service';
import { IBookISBN } from 'src/app/features/books/models/models';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  constructor(private userService: UserService,
              private bookService: BookSearchService,
              private cd: ChangeDetectorRef) {}
  loggedInUser$: Observable<IUser | undefined> | null = null;
  markedBooks$: Observable<IBookISBN[]> | null = null;
  slicedMarkedBooks$: Observable<IBookISBN[]> | null = null;

  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 5;

  ngOnInit(): void {
    this.loggedInUser$ = this.userService.LoggedInUser;
    this.loggedInUser$.subscribe(
      (res) => {
        this.markedBooks$ = this.bookService.getBooks(res?.history!);
        this.slicedMarkedBooks$ = this.getPaginated(this.markedBooks$);
      }
    );
  }

  onRemove(key: string): void {
    this.userService.removeBook(key).subscribe(
      (removed) => {
        if (removed) {
          this.loggedInUser$ = this.userService.LoggedInUser;
          this.loggedInUser$.subscribe(
            (res) => {
              this.markedBooks$ = this.bookService.getBooks(res?.history!);
              this.slicedMarkedBooks$ = this.getPaginated(this.markedBooks$);
              this.cd.markForCheck();
            }
          );
        }
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.slicedMarkedBooks$ = this.getPaginated(this.markedBooks$!);
  }

  private getPaginated(books$: Observable<IBookISBN[]>): Observable<IBookISBN[]> {
    return books$.pipe(
      map((books) => {
        this.totalPages = Math.ceil(books.length / this.limit);
        const startIndex = (this.currentPage-1)*this.limit;
        const endIndex = Math.min(startIndex+this.limit, books.length);
        return books.slice(startIndex,endIndex);
      })
    );
  }
}

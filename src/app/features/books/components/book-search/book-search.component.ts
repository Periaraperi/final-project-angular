import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSearchService } from '../../services/book-search.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { WorksListComponent } from '../works-list/works-list.component';
import { IBookISBN, IWork } from '../../models/models';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/features/users/services/user.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorksListComponent, BookDetailsComponent, RouterLink, PaginationComponent],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent {
  constructor(private bookService: BookSearchService,
              private userService: UserService) {
    this.searchBy.setValue(this.options[0]);
  }

  options: string[] = ["title", "query", "author", "isbn"];

  works$: Observable<IWork[]> | null = null;
  slicedWorks$: Observable<IWork[]> | null = null;
  specificBook$: Observable<IBookISBN> | null = null; // book found by isbn

  isLoggedIn$ = this.userService.isLoggedIn$;

  // form ==============================
  form = new FormGroup({
    searchBar: new FormControl(''),
    searchBy: new FormControl('', Validators.required)
  });
  searchBar = this.form.get('searchBar') as FormControl;
  searchBy = this.form.get('searchBy') as FormControl;
  // form ==============================

  waiting = false;

  // pagination details
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  onSearch(): void {
    this.works$ = null;
    this.specificBook$ = null;
    this.waiting = false;
    this.resetPaginationDetails();

    if (this.searchBy.value==="title") {
      if (this.searchBar.value!==null) {
        this.waiting = true;
        this.works$ = this.bookService.searchByTitle(this.searchBar.value);
      }
    } else if (this.searchBy.value==="query") {
      if (this.searchBar.value!==null) {
        this.waiting = true;
        this.works$ = this.bookService.searchByQuery(this.searchBar.value);
      }
    } else if (this.searchBy.value==="author") {
      if (this.searchBar.value!==null) {
        this.waiting = true;
        this.works$ = this.bookService.searchByAuthor(this.searchBar.value);
      }
    } else if (this.searchBy.value==="isbn") {
      if (this.searchBar.value!==null) {
        this.waiting = true;
        this.specificBook$ = this.bookService.searchByISBN(this.searchBar.value);
      }
    }

    if (this.works$!==null) {
      this.slicedWorks$ = this.getPaginated(this.works$);
    }
  }

  onMarkBook(key: string) {
    console.log(key);
    this.userService.addBook(key);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.slicedWorks$ = this.getPaginated(this.works$!);
  }


  private getPaginated(works$: Observable<IWork[]>): Observable<IWork[]> {
    return works$.pipe(
      map((works) => {
        this.totalPages = Math.ceil(works.length / this.limit);
        const startIndex = (this.currentPage-1)*this.limit;
        const endIndex = Math.min(startIndex+this.limit, works.length);
        return works.slice(startIndex, endIndex);
      })
    );
  }

  private resetPaginationDetails() {
    this.totalPages = 0;
    this.currentPage = 1;
    this.limit = 10;
  }

}

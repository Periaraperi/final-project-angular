import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorApiData, BookSearchService, IEditions, IWork } from '../../services/book-search.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IISBNBook } from '../../models/book-model';
import { Observable, catchError, forkJoin, map, of, switchMap} from 'rxjs';
import { SearchResultComponent } from '../search-result/search-result.component';
import { AuthorService } from '../../services/author.service';
import { IAuthor } from '../../models/author-model';
import { DEFAULT_WORK } from '../../services/book-search.service';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchResultComponent],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent {

  constructor(private bookService: BookSearchService, private authorService: AuthorService) {
    this.searchBy.setValue(this.options[0]);
  }

  options: string[] = ["ISBN", "Title"];
  bookToOutput$: Observable<IISBNBook> | null = null;
  booksByTitle$: Observable<{title: string, description: string}[]> | null = null;

  bookDocs$: Observable<{docs:{key: string}[]}> | null = null;
  worksFromDocs$: Observable<IWork[]> | null = null;

  form = new FormGroup({
    searchBar: new FormControl(''),
    searchBy: new FormControl('', Validators.required)
  });

  searchBar = this.form.get('searchBar') as FormControl;
  searchBy = this.form.get('searchBy') as FormControl;

  onSearch(): void {
    console.log(this.searchBar.value);
    console.log(this.searchBy.value);

    this.booksByTitle$ = null;
    this.bookToOutput$ = null;

    if (this.searchBy.value==="ISBN") {
      if (this.searchBar.value!==null) {
        this.bookToOutput$ = this.bookService.searchBookByISBN(this.searchBar.value);
      }
    } else if (this.searchBy.value==="Title") {
      console.log("unda movzebno titleti");
      if (this.searchBar.value!==null) {
        this.bookDocs$ = this.bookService.searchByTitle2(this.searchBar.value);

        this.worksFromDocs$ = this.bookDocs$.pipe(
          switchMap((res) => {
            if (res.docs.length===0) return of([]);

            const workObservables: Observable<IWork>[] = res.docs.map((x) => {
              return this.bookService.getWork(x.key).pipe(
                catchError(() => {
                  return of(DEFAULT_WORK);
                })
              );
            });

            return forkJoin(workObservables).pipe(
              map((works) => {
                return works.filter((w) => {
                  return w.key!=="-1";
                });
              })
            );
          })
        );
      }
    }
  }

  // ==================================================================
  // test things ======================================================
  // ==================================================================

  authors: (Observable<IAuthor[]> | null)[] = [];

  work$: Observable<IWork> | null = null;
  onFetchWork() {
    this.work$ = this.bookService.getWork("/works/OL45804W");
    //this.work$ = this.bookService.getWork("/works/OL483391W");
    //this.work$ = this.bookService.getWork("/works/OL3939759W");
  }

  editions$: Observable<IEditions> | null = null;
  onGetEditons() {
    this.editions$ = this.bookService.getEditions("/works/OL45804W");
    //this.editions$ = this.bookService.getEditions("/works/OL27269313W");
    //this.editions$ = this.bookService.getEditions("/works/OL3939759W");
    //this.editions$ = this.bookService.getEditions("/works/OL27448W");
    this.authors = [];
    this.editions$.forEach(() => {
      this.authors.push(null);
    });
  }

  onGetAuthorData(authors: AuthorApiData[], i: number) {
    console.log(authors.length);
    this.authors[i] = this.authorService.getAuthors(authors);
  }

}

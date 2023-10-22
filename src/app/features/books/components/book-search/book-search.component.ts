import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSearchService, IEditions, IWork } from '../../services/book-search.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IISBNBook } from '../../models/book-model';
import { Observable, map, of, switchMap} from 'rxjs';
import { SearchResultComponent } from '../search-result/search-result.component';
import { AuthorService } from '../../services/author.service';
import { IAuthor } from '../../models/author-model';

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
        this.booksByTitle$ = this.bookService.searchByTitle(this.searchBar.value);
        this.booksByTitle$.subscribe((res) => {
          console.log(res);
        });
      }
    }
  }

  // ==================================================================
  // test things ======================================================
  // ==================================================================

  work$: Observable<IWork> | null = null;
  onFetchWork() {
    this.work$ = this.bookService.getWork("/works/OL45804W");
    //this.work$ = this.bookService.getWork("/works/OL483391W");
    //this.work$ = this.bookService.getWork("/works/OL3939759W");
  }

  editions$: Observable<IEditions> | null = null;
  onGetEditons() {
    //this.editions$ = this.bookService.getEditions("/works/OL45804W");
    //this.editions$ = this.bookService.getEditions("/works/OL27269313W");
    //this.editions$ = this.bookService.getEditions("/works/OL3939759W");
    this.editions$ = this.bookService.getEditions("/works/OL27448W");
  }

}

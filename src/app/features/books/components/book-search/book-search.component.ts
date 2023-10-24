import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSearchService } from '../../services/book-search.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WorksListComponent } from '../works-list/works-list.component';
import { IBookISBN, IWork } from '../../models/models';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WorksListComponent, BookDetailsComponent, RouterLink],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent {
  constructor(private bookService: BookSearchService) {
    this.searchBy.setValue(this.options[0]);
  }

  options: string[] = ["title", "query", "author", "isbn"];

  works$: Observable<IWork[]> | null = null;
  specificBook$: Observable<IBookISBN> | null = null; // book found by isbn

  // form ==============================
  form = new FormGroup({
    searchBar: new FormControl(''),
    searchBy: new FormControl('', Validators.required)
  });
  searchBar = this.form.get('searchBar') as FormControl;
  searchBy = this.form.get('searchBy') as FormControl;
  // form ==============================

  waiting = false;

  onSearch(): void {
    this.works$ = null;
    this.specificBook$ = null;
    this.waiting = false;

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
  }
}

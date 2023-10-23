import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, ErrorObserver, switchMap, map, forkJoin, tap } from 'rxjs';
import { FullInfo, IISBNBook } from '../models/book-model';
import { IAuthor } from '../models/author-model';
import { AuthorService } from './author.service';


export interface IWork {
  key: string; // /works/WorkId
  title: string;
  description: string | {type: string; value: string};
  subjects: string[];
  covers: number[]; // id of cover pages
}

export type AuthorApiData = {
    key: string; // api endpoint to get author info /authors/authorID
};
export interface IEditions {
  entries: {
    key: string; // of type /books/OL...M
    title: string;
    publishers: string[];
    publish_date: string;
    number_of_pages: number;
    pagination: string;
    covers: number[];
    authors: AuthorApiData[];
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {

  constructor(private http: HttpClient, private authorService: AuthorService) { }

  private _isbnUrl = "https://openlibrary.org/isbn/"; // same as /books. need this for general info
  private _worksUrl = "https://openlibrary.org"; // need this for description of book
  private _byTitle = "https://openlibrary.org/search.json?title=";

  searchBookByISBN(isbn: string): Observable<IISBNBook> {
    return this.http.get<IISBNBook>(`${this._isbnUrl}${isbn}.json`);
  }

  getBookDescription(id: string): Observable<{description?:string}> {
    return this.http.get<{description?:string}>(`${this._worksUrl}${id}.json`);
  }

  searchByQuery(query: string): Observable<{docs:{key: string}[]}> {
    return this.http.get<{docs:{key: string}[]}>(`https://openlibrary.org/search.json?q=${query}`);
  }

  searchByTitle(title: string): Observable<{title:string, description:string}[]> {
    console.log(title);
    return this.http.get<{docs:{key: string}[]}>(`${this._byTitle}${title}&sort=new`).pipe(
      switchMap((res) => {
        const arr = res.docs.slice(0,10) as {key: string}[];
        const bookObservables = arr.map((doc) => {
          return this.http.get<{title: string, description: string}>(`https://openlibrary.org${doc.key}.json`);
        });

        console.log(bookObservables);

        return forkJoin(bookObservables).pipe(
          map((res) => {
            return res;
          })
        );

      })
    );
  }

  getFullInfo(isbn: string): Observable<FullInfo> {
    const bookByIsbn$ = this.http.get<IISBNBook>(`${this._isbnUrl}${isbn}.json`);
    bookByIsbn$.subscribe((res)=>{console.log(res)});
    const bookWithDescription$ = bookByIsbn$.pipe(
      switchMap((book) => {
        return this.getBookDescription(book.works[0].key).pipe(
          tap((res) => {console.log("YLE",res);}),
          map((res) => {
            return {...book, description: res.description};
          })
        )
      })
    );

    return bookWithDescription$.pipe(
      switchMap((book) => {
        const authorObservables = book.authors.map((author) => {
          console.log(author.key);
          return this.authorService.getAuthor(author.key);
        });

        return forkJoin(authorObservables).pipe(
          map((authors) => {
            return {
              ...book,
              authorsDetails:authors
            }
          })
        );

      })
    );
  }

  // ========================================= TEST THINGS ========================================
  // ==============================================================================================
  // ==============================================================================================
  // ==============================================================================================

  getWork(path: string): Observable<IWork> { // path is always /works/WORKID
    return this.http.get<IWork>(`https://openlibrary.org${path}.json`).pipe(
      map((res) => {
        if (typeof res.description === "object") {
          return {...res, description: res.description.value};
        }
        return res;
      })
    );
  }

  getEditions(path: string): Observable<IEditions> { // path is always /works/WORKID
    return this.http.get<IEditions>(`https://openlibrary.org${path}/editions.json`);
  }

  /*
  getEditionsWithAuthorInfo(path: string): Observable<IEditions> { // path is always /works/WORKID
    const editions$ = this.http.get<IEditions>(`https://openlibrary.org${path}/editions.json`);
    return editions$.pipe(
      switchMap((editions) => {
        const authorObservables: Observable<IAuthor[]>[] = [];

        for (const entry of editions.entries) {
          const aa: Observable<IAuthor>[] = entry.authors.map((a) => {
            return this.authorService.getAuthor((a as AuthorApiData).author.key);
          });
          authorObservables.push(forkJoin(aa));
        }

        return forkJoin(authorObservables).pipe(
          map((a) => {
            let idx = 0;
            while (idx<a.length) {
              editions.entries[idx].authors = a[idx];
              ++idx;
            }
            return editions;
          })
        );

      })
    );
  }
  */

}

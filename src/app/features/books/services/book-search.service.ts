import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, ErrorObserver, switchMap, map, forkJoin, tap, of } from 'rxjs';
import { IWork, IEditions, DEFAULT_WORK, IBookISBN, DEFAULT_ISBN_BOOK } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {

  constructor(private http: HttpClient) { }

  //private _isbnUrl = "https://openlibrary.org/isbn/"; // same as /books. need this for general info
  //private _worksUrl = "https://openlibrary.org"; // need this for description of book

  // get many works according to match
  public searchByQuery(query: string): Observable<IWork[]> {
    const res = this.http.get<{docs:{key: string}[]}>(`https://openlibrary.org/search.json?q=${query}`);
    return this.modified(res);
  }

  public searchByTitle(title: string): Observable<IWork[]> {
    const res = this.http.get<{docs:{key: string}[]}>(`https://openlibrary.org/search.json?title=${title}`);
    return this.modified(res);
  }

  public searchByAuthor(author: string): Observable<IWork[]> {
    const res = this.http.get<{docs:{key: string}[]}>(`https://openlibrary.org/search.json?author=${author}&sort=new`);
    return this.modified(res);
  }

  public searchByISBN(isbn: string): Observable<IBookISBN> {
    return this.http.get<IBookISBN>(`https://openlibrary.org/isbn/${isbn}.json`);
  }

  public getBooks(bookKeys: {key:string}[]): Observable<IBookISBN[]> {
    console.log(bookKeys);
    if (bookKeys.length===0) return of([]);
    const bookObservables = bookKeys.map((elem) => {
      return this.http.get<IBookISBN>(`https://openlibrary.org${elem.key}.json`).pipe(
        catchError(() => {return of(DEFAULT_ISBN_BOOK)})
      );
    });
    return forkJoin(bookObservables).pipe(
      map((data) => {
        return data.filter((elem) => {return elem.key!==""});
      })
    );
  }

  public getWorks(workIds: string[]): Observable<IWork[]> {
    const workObservables = workIds.map((workId) => {return this.getWork(workId);});
    return forkJoin(workObservables);
  }

  // returns all found editions of specific work
  getEditions(path: string): Observable<IEditions> { // path is always /works/WORKID
    return this.http.get<IEditions>(`https://openlibrary.org${path}/editions.json`);
  }

  private getWork(path: string): Observable<IWork> { // path is always /works/WORKID
    return this.http.get<IWork>(`https://openlibrary.org${path}.json`).pipe(
      map((res) => {
        if (typeof res.description === "object") {
          return {...res, description: res.description.value};
        }
        return res;
      })
    );
  }

  // this will modify data so that other components can read easily
  // also used by several functions
  private modified(obs: Observable<{docs:{key: string}[]}>): Observable<IWork[]> {
      return obs.pipe(
      switchMap((res) => {
        if (res.docs.length===0) return of([]);

        const workObservables: Observable<IWork>[] = res.docs.map((x) => {
          return this.getWork(x.key).pipe(
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

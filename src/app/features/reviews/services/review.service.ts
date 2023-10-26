import { Injectable } from '@angular/core';
import { DEFAULT_REVIEW, IReview } from '../models/models';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LibId } from 'src/app/core/models/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http:HttpClient) { }

  private _url = "http://localhost:3000/reviews";

  exists(bookId: string): Observable<boolean> {
    const enc = encodeURIComponent(bookId);
    return this.http.get<IReview>(`${this._url}/${enc}`).pipe(
      map(() => {return true;}),
      catchError((e: HttpErrorResponse) => {
        if (e.status===404) {
          return of(false);
        }
        return of(true);
      }),
    );
  }

  addBook(bookId: string) {
    return this.http.post<void>(`${this._url}`, {id: bookId, texts:[]});
  }

  getReviews(bookId: string): Observable<IReview> {
    const enc = encodeURIComponent(bookId);
    console.log(enc);
    return this.http.get<IReview>(`${this._url}/${enc}`).pipe(
      catchError(() => {
        return of(DEFAULT_REVIEW);
      })
    );
  }

  getAllReviews(): Observable<IReview[]> {
    return this.http.get<IReview[]>(this._url);
  }

  addReview(bookId: string, val: string, user: LibId): Observable<IReview | null> {
    const rev$ = this.getReviews(bookId);
    return rev$.pipe(
      switchMap((res) => {
        if (res.id!=="") {
          const enc = encodeURIComponent(bookId);
          const patchedData = {texts:[...res.texts, {userId:user, value:val}]}
          return this.http.patch<IReview>(`${this._url}/${enc}`, patchedData);
        }
        return of(null);
      })
    );
  }

}

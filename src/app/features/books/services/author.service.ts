import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { AuthorEndPoint, IAuthor} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient) { }

  private baseUrl = "https://openlibrary.org";

  getAuthor(path: string): Observable<IAuthor> {
    return this.http.get<IAuthor>(`${this.baseUrl}${path}.json`).pipe(
      map((a) => {
        if (typeof a.bio==='object') {
          return {...a, bio:a.bio.value};
        }
        return a;
      })
    );
  }

  getAuthors(authors: AuthorEndPoint[]): Observable<IAuthor[]> {
    const authorObservables = authors.map((a) => {
      return this.getAuthor(a.key);
    });
    return forkJoin(authorObservables);
  }

}

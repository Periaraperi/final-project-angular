import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { IAuthor } from '../models/author-model';
import { AuthorApiData } from './book-search.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient) { }

  private baseUrl = "https://openlibrary.org";

  getAuthor(path: string): Observable<IAuthor> {
    return this.http.get<IAuthor>(`${this.baseUrl}${path}.json`);
  }

  getAuthors(authors: AuthorApiData[]) {
    console.log("hehehe");
    const authorObservables = authors.map((a) => {
      return this.getAuthor(a.key);
    });
    console.log("how many authors?: ",authorObservables.length);
    return forkJoin(authorObservables);
  }

}

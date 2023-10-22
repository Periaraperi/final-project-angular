import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthor } from '../models/author-model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient) { }

  private baseUrl = "https://openlibrary.org";

  getAuthor(path: string): Observable<IAuthor> {
    return this.http.get<IAuthor>(`${this.baseUrl}${path}.json`);
  }

}

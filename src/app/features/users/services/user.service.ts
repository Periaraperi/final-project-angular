import { Injectable } from '@angular/core';
import { IUser } from '../models/user-model';
import { Observable, pipe, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { genId } from 'src/app/core/utils';
import { LibId } from 'src/app/core/models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _usersDbUrl: string = 'http://localhost:3000/users';
  private _registeredUsers$: Observable<IUser[]> | null = null;
  private _idMap: Map<LibId,boolean> = new Map<LibId,boolean>();

  constructor(private http: HttpClient) {
    // get all users from DB
    this._registeredUsers$ = this.http.get<IUser[]>(this._usersDbUrl);
    this._registeredUsers$.subscribe((users) => {
      users.forEach((user) => {this._idMap.set(user.id!,true)});
    });
  }

  registerUser(newUserData: IUser): Observable<void> {
    let newId = genId();
    while (this._idMap.has(newId)) {
      newId = genId();
    }
    this._idMap.set(newId,true);
    newUserData = {...newUserData, id:newId};
    return this.http.post<void>(this._usersDbUrl,newUserData);
  }

  isUserValid(newUserData: IUser): Observable<boolean> {
    return this._registeredUsers$?.pipe(
      tap((users) => {
        console.log(users);
      }),
      map((users) => {
        return !users.some((user) => {
          return user.email===newUserData.email;
        });
      })
    )!;
  }

}

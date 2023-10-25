import { Injectable } from '@angular/core';
import { IUser } from '../models/user-model';
import { Observable, pipe, map, tap, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { genId } from 'src/app/core/utils';
import { LibId } from 'src/app/core/models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _usersDbUrl: string = 'http://localhost:3000/users';
  private _registeredUsers$: Observable<IUser[]> | null = null;
  private _idMap: Map<LibId,IUser> = new Map<LibId,IUser>();

  private _currentlyLoggedInUser: IUser | undefined = undefined;
  get LoggedInUser(): Observable<IUser | undefined> {
    return of(this._currentlyLoggedInUser);
  }

  // need this for shared info. Topbar needs this
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  // guards use this function
  isAuthorized(): boolean {
    return this._currentlyLoggedInUser!==undefined;
  }

  constructor(private http: HttpClient) {
    // get all users from DB
    this._registeredUsers$ = this.http.get<IUser[]>(this._usersDbUrl);
    this._registeredUsers$.subscribe((users) => {
      users.forEach((user) => {this._idMap.set(user.id!,user)});
    });
  }

  registerUser(newUserData: IUser): Observable<void> {
    let newId = genId();
    while (this._idMap.has(newId)) {
      newId = genId();
    }
    newUserData = {...newUserData, id:newId};
    this._idMap.set(newId,newUserData);
    return this.http.post<void>(this._usersDbUrl,newUserData);
  }

  userExists(email: string, password: string): Observable<LibId> {
    this._registeredUsers$ = this.http.get<IUser[]>(this._usersDbUrl);
    return this._registeredUsers$.pipe(
      map((users) => {
        const foundUser = users.find((user) => {
          return user.email===email && user.password===password;
        });
        if (foundUser!==undefined) {
          return foundUser.id!;
        }
        return "";
      })
    );
  }

  loginUser(id: LibId): void {
    this._currentlyLoggedInUser = this._idMap.get(id);
    this._isLoggedIn.next(true);
  }
  logOutUser(): void {
    this._currentlyLoggedInUser = undefined;
    this._isLoggedIn.next(false);
  }

  isUserValid(newUserData: IUser): Observable<boolean> {
    return this._registeredUsers$?.pipe(
      map((users) => {
        return !users.some((user) => {
          return user.email===newUserData.email;
        });
      })
    )!;
  }


}

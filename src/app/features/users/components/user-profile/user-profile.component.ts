import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user-model';
import { Observable, of, switchMap } from 'rxjs';
import { BookSearchService } from 'src/app/features/books/services/book-search.service';
import { IBookISBN } from 'src/app/features/books/models/models';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  constructor(private userService: UserService,
              private bookService: BookSearchService,
              private cd: ChangeDetectorRef) {}
  loggedInUser$: Observable<IUser | undefined> | null = null;
  markedBooks$: Observable<IBookISBN[]> | null = null;

  ngOnInit(): void {
    console.log("ngInit");
    this.loggedInUser$ = this.userService.LoggedInUser;
    this.loggedInUser$.subscribe(
      (res) => {
        console.log("shevedi");
        console.log(res?.history.length);
        this.markedBooks$ = this.bookService.getBooks(res?.history!);
        this.markedBooks$.subscribe((res) => {console.log(res.length);});
      }
    );
  }

  onRemove(key: string): void {
    this.userService.removeBook(key).subscribe(
      (removed) => {
        if (removed) {
          this.loggedInUser$ = this.userService.LoggedInUser;
          this.loggedInUser$.subscribe(
            (res) => {
              this.markedBooks$ = this.bookService.getBooks(res?.history!);
              this.cd.markForCheck();
            }
          );
        }
      }
    );
  }

}

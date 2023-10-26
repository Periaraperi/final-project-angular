import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { IReview } from '../../models/models';
import { ReviewService } from '../../services/review.service';
import { IBookISBN } from 'src/app/features/books/models/models';
import { BookSearchService } from 'src/app/features/books/services/book-search.service';
import { BookDetailsComponent } from 'src/app/features/books/components/book-details/book-details.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/features/users/services/user.service';
import { IUser } from 'src/app/features/users/models/user-model';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookDetailsComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent implements OnInit {

  bookId = "";
  allReviews$: Observable<IReview | null> | null = null;
  userNames$: Observable<IUser[] | null> | null = null;
  book$: Observable<IBookISBN> | null = null;

  isLoggedIn$ = this.userService.isLoggedIn$;
  get us() {return this.userService;}

  form = new FormGroup({
    comment: new FormControl('',[Validators.required, Validators.maxLength(500)])
  });

  comment = this.form.get('comment') as FormControl;

  constructor(private route: ActivatedRoute,
              private reviewService: ReviewService,
              private bookService: BookSearchService,
              private userService: UserService,
              private cd: ChangeDetectorRef) {
    this.bookId = this.route.snapshot.paramMap.get('bookId')!;
    console.log(this.bookId);
  }

  ngOnInit(): void {
    console.log("init review");
    this.updateData();
  }

  onComment(): void {
    console.log("hehe",this.comment.getRawValue());
    console.log(this.userService.LoggedInUserId);
    const val = this.comment.getRawValue();
    this.reviewService.addReview(this.bookId, val, this.userService.LoggedInUserId).subscribe(() => {
      this.updateData();
      this.comment.reset();
      this.cd.markForCheck();
    });
  }

  private updateData() {
    this.allReviews$ = this.reviewService.getReviews(this.bookId).pipe(
      map((res) => {
        if (res.id==="") return null;
        return res;
      })
    );
    this.userNames$ = this.allReviews$.pipe(
      switchMap((res) => {
        if (res!==null) {
          const userObservables = res.texts.map((elem) => {
            return this.userService.getUserInfo(elem.userId);
          });
          return forkJoin(userObservables);
        }
        return of(null);
      })
    );
    this.book$ = this.bookService.getBooks([{key:this.bookId}]).pipe(
      switchMap((res) => {
        return of(res[0]);
      })
    );
  }

}

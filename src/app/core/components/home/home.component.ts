import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSearchService } from 'src/app/features/books/services/book-search.service';
import { IWork } from 'src/app/features/books/models/models';
import { Observable, map, of, switchMap } from 'rxjs';
import { WorksListComponent } from 'src/app/features/books/components/works-list/works-list.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WorksListComponent, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(private bookService: BookSearchService) {}

  workIds: string[] = [
    "/works/OL25322658W",
    "/works/OL81632W",
    "/works/OL35603160W",
    "/works/OL23746568W",
    "/works/OL82586W",
    "/works/OL3140834W",
    "/works/OL17860744W",
    "/works/OL257943W",
    "/works/OL81613W",
    "/works/OL45875W"
  ];

  trendingWorks$: Observable<IWork[]> | null = null;
  slicedWorks$: Observable<IWork[]> | null = null;

  ngOnInit(): void {
    this.trendingWorks$ = this.bookService.getWorks(this.workIds);
    this.slicedWorks$ = this.trendingWorks$.pipe(
      switchMap((res) => {
        return this.getPaginated(res);
      })
    );
  }

  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 5;

  onPageChange(page: number): void {
    this.currentPage = page;
    this.slicedWorks$ = this.trendingWorks$!.pipe(
      switchMap((res) => {
        return this.getPaginated(res);
      })
    );
  }

  private getPaginated(works: IWork[]): Observable<IWork[]> {
    this.totalPages = Math.ceil(works.length / this.limit);
    const startIndex = (this.currentPage-1)*this.limit;
    const endIndex = Math.min(startIndex+this.limit, works.length);
    return of(works.slice(startIndex, endIndex));
  }

}

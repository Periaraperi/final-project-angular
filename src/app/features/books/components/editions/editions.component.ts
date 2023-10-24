import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BookSearchService } from '../../services/book-search.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { AuthorEndPoint, IEditions } from '../../models/models';

@Component({
  selector: 'app-editions',
  standalone: true,
  imports: [CommonModule, RouterLink, BookDetailsComponent],
  templateUrl: './editions.component.html',
  styleUrls: ['./editions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionsComponent {
  editions$: Observable<IEditions> | null = null;

  workId: string = "";

  showDetails: boolean[] = [];

  constructor(private route: ActivatedRoute,
              private bookService: BookSearchService,
              private authorService: AuthorService) {
    this.workId = this.route.snapshot.paramMap.get('workId')!;

    this.editions$ = this.bookService.getEditions(this.workId);
  }

  getAuthorData(authors: AuthorEndPoint[]) {
    return this.authorService.getAuthors(authors);
  }

  onShowDetails(i: number) {
    this.showDetails[i] = true;
  }

  onHideDetails(i: number) {
    this.showDetails[i] = false;
  }
}

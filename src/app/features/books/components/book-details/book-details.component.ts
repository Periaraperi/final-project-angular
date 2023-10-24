import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IAuthor } from '../../models/models';
import { AuthorEndPoint } from '../../models/models';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent implements OnInit {
  @Input() title: string | null = null;
  @Input() subjects: string[] | null = null;
  @Input() pagination: string | null = null;
  @Input() pageCount: number | null = null;
  @Input() publishDate: string | null = null;
  @Input() publishers: string[] | null = null;
  @Input() authors: AuthorEndPoint[] | null = null;
  authorsData$: Observable<IAuthor[]> | null = null;

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    if (this.authors) {
      this.authorsData$ = this.authorService.getAuthors(this.authors);
    }
  }

}

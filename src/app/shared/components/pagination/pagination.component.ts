import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Output() pageChanged = new EventEmitter<number>();

  @Input() waitingForSearch: boolean = false;

  prevPage() {
    if (this.currentPage>1) {
      this.pageChanged.emit(this.currentPage-1);
    }
  }

  nextPage() {
    if (this.currentPage<this.totalPages) {
      this.pageChanged.emit(this.currentPage+1);
    }
  }
}

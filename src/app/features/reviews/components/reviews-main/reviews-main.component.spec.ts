import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsMainComponent } from './reviews-main.component';

describe('ReviewsMainComponent', () => {
  let component: ReviewsMainComponent;
  let fixture: ComponentFixture<ReviewsMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewsMainComponent]
    });
    fixture = TestBed.createComponent(ReviewsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

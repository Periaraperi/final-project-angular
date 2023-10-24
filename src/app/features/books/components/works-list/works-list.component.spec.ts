import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksListComponent } from './works-list.component';

describe('WorksListComponent', () => {
  let component: WorksListComponent;
  let fixture: ComponentFixture<WorksListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorksListComponent]
    });
    fixture = TestBed.createComponent(WorksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

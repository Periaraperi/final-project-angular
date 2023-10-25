import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { UserService } from 'src/app/features/users/services/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  constructor(private userService: UserService, private router: Router) {}
  isLoggedIn$ = this.userService.isLoggedIn$;

  onLogOut() {
    this.userService.logOutUser();
    this.router.navigate(['/home']);
  }
}

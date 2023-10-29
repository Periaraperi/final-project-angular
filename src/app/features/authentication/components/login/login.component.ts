import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/features/users/services/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  constructor(private router: Router,
              private userService: UserService,
              private cd: ChangeDetectorRef) {
    userService.isLoggedIn$.subscribe();
  }

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // shortcuts
  email = this.form.get('email') as FormControl;
  password = this.form.get('password') as FormControl;

  invalidUser$: Observable<boolean> | null = null;

  onLogin(): void {
    const data = this.form.getRawValue();
    if (data.email !== null && data.password !== null) {
      this.userService.userExists(data.email, data.password).subscribe(
        (id) => {
          if (id!=="") {
            console.log("Successful login");
            this.userService.loginUser(id);
            this.invalidUser$ = of(false);
            this.router.navigate(['./users/profile']);
          } else {
            console.log("user not valid");
            this.invalidUser$ = of(true);
            this.cd.markForCheck();
          }
        }
      );
    }
  }

}

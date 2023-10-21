import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  constructor(private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // shortcuts
  email = this.form.get('email') as FormControl;
  password = this.form.get('password') as FormControl;

  onLogin(): void {
    console.log("login ara yle");
    // check if user with this email and password exists.
    this.router.navigate(['./users/profile']);
  }

}

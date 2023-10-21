import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/features/users/services/user.service';
import { IUser } from 'src/app/features/users/models/user-model';

import { passwordValidation } from '../../validators/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  constructor(private userService: UserService, private cd: ChangeDetectorRef) {}

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    nickname: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormGroup({
      pass1: new FormControl('',[Validators.required, Validators.minLength(8)]),
      pass2: new FormControl('',[Validators.required]),
    }, passwordValidation()),
  });

  // ===============form control shortcuts=======================
  email = this.form.get('email') as FormControl;
  nickname = this.form.get('nickname') as FormControl;
  password = this.form.get('password') as FormGroup;
  pass1 = this.password.get('pass1') as FormControl;
  pass2 = this.password.get('pass2') as FormControl;
  // ============================================================

  onRegister(): void {
    const formValues = this.form.getRawValue();
    const newUserData: IUser = {
      email: formValues.email!,
      nickname: formValues.nickname!,
      password: formValues.password.pass1!
    };
    this.userService.isUserValid(newUserData).subscribe(
      (ok) => {
        if (ok) {
          this.userService.registerUser(newUserData).subscribe(() => {
            this.form.reset();
            this.cd.markForCheck();
          });
        } else {
          window.alert(`User with email: ${newUserData.email} already exists`);
          this.email.reset();
          this.cd.markForCheck();
        }
      }
    );
  }

}

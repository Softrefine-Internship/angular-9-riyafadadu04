import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.matchPassword,
      ]),
    });
  }

  matchPassword(control: FormControl): { [s: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { notMatch: true };
    }
    return null;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, password } = this.signupForm.value;
      this.authService.signup(email, password, firstName, lastName).subscribe(
        (response) => {
          console.log('Signup successful:', response);
          this.router.navigate(['/']);
          this.signupForm.reset();
        },
        (error) => {
          console.error('Signup failed:', error);
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}

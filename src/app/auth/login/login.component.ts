import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginform!: FormGroup;
  errorMsg!: string;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginform = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^.{8,}$/),
      ]),
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onlogin() {
    if (this.loginform.valid) {
      const { email, password } = this.loginform.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login successful', response);
          if (response && response.idToken) {
            this.router.navigate(['/blog']);
            this.loginform.reset();
          }
        },
        (error) => {
          this.errorMsg = error;
          console.error('Login error:', error);
        }
      );
    } else {
      this.loginform.markAllAsTouched();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiKey = 'AIzaSyBwmTat_yCR671SZzWVA3tfO57RpuMeTfc';
  private authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private dbUrl =
    'https://ng-blogs-66277-default-rtdb.firebaseio.com/blogs.json';

  private _user = new BehaviorSubject<any>(null);
  user = this._user.asObservable();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  login(email: string, password: string): Observable<any> {
    const loginData = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.http
      .post<any>(
        `${this.authUrl}:signInWithPassword?key=${this.apiKey}`,
        loginData
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          if (!response.registered) {
            throw new Error('Email not verified. Please verify your email.');
          }
          this.storeUserData(response);
        })
      );
  }

  signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<any> {
    const signupData = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.http
      .post<any>(`${this.authUrl}:signUp?key=${this.apiKey}`, signupData)
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          const userId = response.localId;
          const userData = { email, firstName, lastName, password, userId };
          this.saveUserData(userId, userData).subscribe(() => {
            console.log('User data saved:', userData);
          });
        })
      );
  }

  logout() {
    localStorage.removeItem('userData');
    this._user.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userData');
  }

  autoLogin() {
    const userData: {
      email: string;
      userId: string;
      token: string;
      tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) {
      return;
    }

    const loadedUser = {
      email: userData.email,
      userId: userData.userId,
      token: userData.token,
      tokenExpirationDate: new Date(userData.tokenExpirationDate),
    };

    if (new Date() < loadedUser.tokenExpirationDate) {
      this._user.next(loadedUser);
      const expirationDuration =
        loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.router.navigate(['/blog']);
    } else {
      this.logout();
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private saveUserData(userId: string, userData: any): Observable<any> {
    return this.http.post<any>(`${this.dbUrl}`, userData);
  }

  private storeUserData(authData: any) {
    const expirationDate = new Date(
      new Date().getTime() + +authData.expiresIn * 1000
    );
    const user = {
      email: authData.email,
      passwords: authData.passwords,
      userId: authData.localId,
      token: authData.idToken,
      tokenExpirationDate: expirationDate,
    };
    localStorage.setItem('userData', JSON.stringify(user));
    this._user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    console.log(errorRes);

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address is already in use.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email address does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is incorrect.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid email and password.';
        break;
    }
    return throwError(() => errorMessage);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  onClickLogin() {
    this.router.navigate(['/']);
  }

  onClickSignUP() {
    this.router.navigate(['/signup']);
  }

  onClickLogout() {
    this.authService.logout();
  }
}

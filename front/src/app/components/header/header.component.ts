import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth: boolean;
  authSubscription: Subscription;
  userId: string;
  photo?: string;

  constructor(private auth: AuthService,
              private router: Router) { }


  ngOnInit(): void {
    this.authSubscription = this.auth.isAuth$.subscribe(
      auth => this.isAuth = auth);
    this.photo = this.auth.getPhoto();
    this.userId = this.auth.getUserId();
    }

  onClickUser(): void {
    this.router.navigate(['user', this.userId]);

  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['user/login']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}

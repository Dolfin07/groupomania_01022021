import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  id: string = this.getUserId();
  userId: string;
  authToken: string;
  photo: string;
  admin: string;
  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createUser(user: User, photo: File): Observable<User> {
    const formData = new FormData();
    formData.append('stringData', JSON.stringify(user));
    formData.append('photo', photo);
    return this.http
      .post(`${this.api}/user/signup`, formData)
      .pipe(catchError((error: any) => throwError(error)));
  }

  loginUser(email: string, password): any {
    this.http
      .post(`${this.api}/user/login`, { email, password })
      .subscribe(
        (response: {
          userId: string;
          token: string;
          photo: string;
          admin: string;
        }) => {
          this.userId = response.userId;
          this.authToken = response.token;
          this.photo = response.photo;
          this.admin = response.admin;
          this.isAuth$.next(true);
        }
      );
  }

  logout(): void {
    this.authToken = null;
    this.userId = null;
    this.photo = null;
    this.admin = 'false';
    this.isAuth$.next(false);
  }

  getToken(): string {
    return this.authToken;
  }

  getUserId(): string {
    return this.userId;
  }

  getPhoto(): string {
    return this.photo;
  }

  getAdmin(id: string): string {
    return this.admin;
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get(`${this.api}/user/` + id)
      .pipe(catchError((error: any) => throwError(error)));
  }

  modifyUser(id: string, user: string, photo: File): Observable<User> {
    const formData = new FormData();
    formData.append('stringData', JSON.stringify(user));
    formData.append('photo', photo);
    return this.http
      .put(`${this.api}/user/` + id, formData)
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteUser(id: string): Observable<User> {
    return this.http
      .delete(`${this.api}/user/` + id)
      .pipe(catchError((error: any) => throwError(error)));
  }
}

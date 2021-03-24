import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  userId: string;
  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getOnePost(id: string): Observable<Post> {
    return this.http
      .get(`${this.api}/post/` + id)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  getAllPostsByDate(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.api}/post/date`)
      .pipe(catchError((error: any) => throwError(error)));
  }

  getAllPostsByLiked(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.api}/post/liked`)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  getAllPostsByAutor(id: string): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.api}/post/autor/` + id)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  createPost(post: Post, image: File): Observable<Post> {
    const formData = new FormData();
    formData.append('stringData', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .post(`${this.api}/post`, formData)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  modifyPost(id: string, post: string, image: File): Observable<Post> {
    const formData = new FormData();
    formData.append('stringData', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .put(`${this.api}/post/` + id, formData)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  deletePost(id: string): Observable<Post> {
    return this.http
      .delete(`${this.api}/post/` + id)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  likedPost(id: string): Observable<Post> {
    this.userId = this.auth.getUserId();
    const stringData = { userId: this.userId };
    console.log(this.userId);
    return this.http
      .post<Post>(`${this.api}/post/like/` + id, stringData)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }

  nbComments(id: string): Observable<Post> {
    const stringData = { postId: id };
    return this.http
      .post<Post>(`${this.api}/post/nb_comments/`, stringData)
      .pipe(catchError((error: any) => throwError(JSON.stringify(error))));
  }
}

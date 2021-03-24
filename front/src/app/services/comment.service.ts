import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  userId: string = this.auth.getUserId();
  private api = 'http://localhost:3000/api';
  private idcomment: string;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCommentId(): string {
    return this.idcomment;
  }

  getAllComments(id: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.api}/comment/` + id)
      .pipe(catchError((error: any) => throwError(error)));
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http
      .post<Comment>(`${this.api}/comment/`, comment)
      .pipe(catchError((error: any) => throwError(error)));
  }

  modifyComment(id: string, comment: string): Observable<Comment> {
    return this.http
      .put<Comment>(`${this.api}/comment/` + id, comment)
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteComment(id: string): Observable<Comment> {
    return this.http
      .delete<Comment>(`${this.api}/comment/` + id)
      .pipe(catchError((error: any) => throwError(error)));
  }
}

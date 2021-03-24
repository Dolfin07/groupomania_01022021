import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css'],
})
export class OnePostComponent implements OnInit {
  user: User;
  post: Post;
  comment: Comment;
  comments: Comment[];
  userId = this.auth.getUserId();
  newCommentForm: FormGroup;
  admin = false;
  isOwner: boolean;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private fB: FormBuilder,
    private auth: AuthService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.postService.getOnePost(params.id).subscribe((post: Post) => {
          this.post = post[0];
          this.initAllDataComment();
        });
      }
    });
    this.initDataComment();
    this.verifAdmin();
  }

  initDataComment(): void {
    this.newCommentForm = this.fB.group({
      content: [null, [Validators.required, Validators.maxLength(2000)]],
    });
  }

  initAllDataComment(): void {
    this.commentService.getAllComments(this.post.idpost).subscribe(
      (comments) => (this.comments = comments),
      (error) => console.error(error)
    );
  }

  verifAdmin(): void {
    if (this.auth.getAdmin(this.userId) === 'TRUE') {
      this.admin = true;
    }
    this.route.params.subscribe((params) => {
      if (params.id === this.userId) {
        this.isOwner = true;
      }
    });
  }

  onLiked(post: Post): void {
    this.postService
      .likedPost(post.idpost)
      .subscribe(() => this.initAllDataComment());
  }

  //  New Comment

  get ncf(): any {
    return this.newCommentForm.controls;
  }

  onSubmitNewComment(post: Post): void {
    const newComment = { ...this.newCommentForm.value };
    newComment.userId = this.userId;
    newComment.postId = post.idpost;
    this.commentService.createComment(newComment).subscribe(() => {
      this.initDataComment();
      this.initAllDataComment();
    });
  }

  //  All Comments

  onDeleteComment(comment: Comment): void {
    this.commentService
      .deleteComment(comment.idcomment)
      .subscribe(() => this.initAllDataComment());
  }

  onBack(): void {
    this.router.navigate(['/post']);
  }

  onClickNamePost(post): void {
    this.router.navigate(['user', post.userId]);
  }

  onClickNameComment(comment): void {
    this.router.navigate(['user', comment.userId]);
  }
}

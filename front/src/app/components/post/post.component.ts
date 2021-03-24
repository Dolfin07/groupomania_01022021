import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Post } from 'src/app/models/post.model';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input()
  post: Post;
  @Output()
  refreshPost = new EventEmitter();

  userId = this.auth.getUserId();
  user: User;
  isOwner = false;
  admin = false;
  comments: Comment[];
  postForm: FormGroup;
  newCommentForm: FormGroup;
  modifyCommentForm: FormGroup;
  imagePreview: string;

  constructor(
    private postService: PostService,
    private fB: FormBuilder,
    private auth: AuthService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  // Initialisation
  ngOnInit(): void {
    this.initDataComment();
    this.initAllDataComment();
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

  // Post

  onDeletePost(post: Post): void {
    this.postService
      .deletePost(post.idpost)
      .subscribe(() => this.refreshPost.emit('refresh'));
  }

  onLiked(post: Post): void {
    this.postService
      .likedPost(post.idpost)
      .subscribe(() => this.refreshPost.emit('refresh'));
  }

  onClickNamePost(post): void {
    this.router.navigate(['user', post.userId]);
  }

  onClickNameComment(comment): void {
    this.router.navigate(['user', comment.userId]);
  }

  // Modal Post

  onSubmitPost(): void {
    const idpost = this.postForm.get('idpost').value;
    const newPost = { ...this.postForm.value };
    newPost.userId = this.userId;
    delete newPost.image;
    delete newPost.idpost;
    const image = this.postForm.get('image').value;
    this.postService
      .modifyPost(idpost, newPost, image)
      .subscribe(() => this.refreshPost.emit('refresh'));
  }

  get f(): any {
    return this.postForm.controls;
  }

  openPost(content, post): void {
    this.postForm = this.fB.group({
      titre: [post.titre, Validators.required],
      image: [this.post.image],
      content: [
        post.content,
        [Validators.required, Validators.maxLength(63000)],
      ],
      idpost: [post.idpost],
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onFileAdded(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.get('image').setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  //  New Comment

  get ncf(): any {
    return this.newCommentForm.controls;
  }

  onSubmitNewComment(post: Post): void {
    const newComment = { ...this.newCommentForm.value };
    newComment.userId = this.userId;
    newComment.postId = post.idpost;
    this.commentService
      .createComment(newComment)
      .subscribe(() => this.refreshPost.emit('refresh'));
  }

  //  All Comments

  onDeleteComment(comment: Comment): void {
    this.commentService
      .deleteComment(comment.idcomment)
      .subscribe(() => this.refreshPost.emit('refresh'));
    this.postService
      .nbComments(comment.postId)
      .subscribe(() => console.log('uddate'));
  }
}

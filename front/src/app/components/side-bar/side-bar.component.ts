import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { PostService } from '../../services/post.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  @Input()
  post: Post;
  @Output()
  refreshPost = new EventEmitter();

  user: User;
  posts: Post[];
  postForm: FormGroup;
  imagePreview: string;
  id: string = this.auth.getUserId();
  firstname: string;
  photo: string;

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private router: Router,
    private fB: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.auth.getUser(this.id).subscribe((user: User) => {
      this.firstname = user[0].firstname;
      this.photo = user[0].photo;
    });
    this.initData();
  }

  get f(): object {
    return this.postForm.controls;
  }

  initData(): void {
    this.postService.getAllPostsByLiked().subscribe(
      (posts) => (this.posts = posts),
      (error) => console.error(error)
    );
  }

  open(content): void {
    this.postForm = this.fB.group({
      titre: [null, [Validators.required, Validators.maxLength(150)]],
      image: [null],
      content: [null, [Validators.required, Validators.maxLength(63000)]],
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

  onSubmit(): void {
    const newPost = { ...this.postForm.value };
    newPost.userId = this.auth.getUserId();
    delete newPost.image;
    const image = this.postForm.get('image').value;
    this.postService
      .createPost(newPost, image)
      .subscribe(() => this.refreshPost.emit('refresh'));
  }

  onClickPost(id: string): void {
    this.router.navigate(['post', id]);
  }
}

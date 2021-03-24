import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil-page',
  templateUrl: './profil-page.component.html',
  styleUrls: ['./profil-page.component.css'],
})
export class ProfilPageComponent implements OnInit {
  posts: Post[];

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.refreshPost();
  }

  refreshPost(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.postService
          .getAllPostsByAutor(params.id)
          .subscribe((posts) => (this.posts = posts));
      }
    });
  }
}

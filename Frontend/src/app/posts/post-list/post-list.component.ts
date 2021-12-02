import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.component.html',
  styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnDestroy {

  posts:Post[] = []
  private postsSub: Subscription;

  constructor(private postService: PostService) {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[])=> {
      this.posts = posts;
    })
   }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }


  onDelete(postId: string) {
     this.postService.deletePost(postId);
  }


}
